'use client';

import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import authStore from '@/store/auth-store';
import { getVideoSocket } from '@/lib/signaling';

export type VCEndReason = 'timeout' | 'remoteEnd' | 'localEnd';

interface VCPeerInfo {
  name?: string;
  avatar?: string;
}

interface VCIncomingPayload {
  from: { socketId: string; name: string; avatar: string };
}

interface VCParticipantInfo {
  id: string;
  name: string;
  avatar: string;
}

interface VideoCallState {
  // Media
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  // UI/state
  incoming: VCIncomingPayload | null;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isRegistered: boolean;
  showCallingBadge: boolean;
  peerInfo: VCPeerInfo | null;
  endReason: VCEndReason | null;
  isDialing: boolean;

  // Actions
  init: () => void;
  placeCall: (participant: VCParticipantInfo) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => Promise<void>;
  endCall: (sendToPeer?: boolean, reason?: VCEndReason) => void;
  toggleAudio: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  clearEndReason: () => void;
}

const vcPcRef: { current: RTCPeerConnection | null } = { current: null };
const vcPeerSocketIdRef: { current: string | null } = { current: null };
const vcPendingIce: { current: RTCIceCandidate[] } = { current: [] };
const vcVideoSenderRef: { current: RTCRtpSender | null } = { current: null };
const vcAudioSenderRef: { current: RTCRtpSender | null } = { current: null };
const vcCallTimeoutRef: { current: number | null } = { current: null };

function vcClearCallTimeout() {
  if (vcCallTimeoutRef.current !== null) {
    clearTimeout(vcCallTimeoutRef.current);
    vcCallTimeoutRef.current = null;
  }
}

function vcCleanupPeer() {
  vcPcRef.current?.close();
  vcPcRef.current = null;
  vcPeerSocketIdRef.current = null;
}

const videoStore: StateCreator<VideoCallState, [['zustand/devtools', never]]> = (set, get) => {
  return {
    localStream: null,
    remoteStream: null,
    incoming: null,
    isAudioMuted: false,
    isVideoOff: false,
    isRegistered: false,
    showCallingBadge: false,
    peerInfo: null,
    endReason: null,
    isDialing: false,

    init: () => {
      const user = authStore.getState().user;
      if (!user?.id) return;

      const socket = getVideoSocket();

      if (!vcPcRef.current) {
        vcPcRef.current = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, {
            username: 'f991DXX2G3GiLwVMPvf0CudKceSs6N596d8i1yX9QHx0_KXJYBgsYyr59qs5C4jnAAAAAGiqdSVyYWhpbDIzNA==',
            credential: 'd76b0c7c-808f-11f0-9e5d-0242ac140004',
            urls: [
              'turn:bn-turn1.xirsys.com:80?transport=udp',
              'turn:bn-turn1.xirsys.com:3478?transport=udp',
              'turn:bn-turn1.xirsys.com:80?transport=tcp',
              'turn:bn-turn1.xirsys.com:3478?transport=tcp',
              'turns:bn-turn1.xirsys.com:443?transport=tcp',
              'turns:bn-turn1.xirsys.com:5349?transport=tcp',
            ],
          }],
        });
        vcPcRef.current.ontrack = (event) => {
          // Merge all remote tracks into a single stream
          const remoteStream = get().remoteStream ?? new MediaStream();
          event.streams[0].getTracks().forEach((track) => {
            if (!remoteStream.getTracks().includes(track)) {
              remoteStream.addTrack(track);
            }
          });
          set({ remoteStream });
        };
        vcPcRef.current.onconnectionstatechange = () => {
          if (vcPcRef.current && vcPcRef.current.connectionState === 'connected') {
            set({ showCallingBadge: false, isDialing: false });
            vcClearCallTimeout();
          }
        };
        vcPcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (vcPeerSocketIdRef.current) {
              socket.emit('webrtc:ice', { toSocketId: vcPeerSocketIdRef.current, candidate: e.candidate });
            } else {
              vcPendingIce.current.push(e.candidate);
            }
          }
        };
      }

      if (!get().isRegistered) {
        socket.emit('register', { name: user?.name, id: user?.id, avatar: user?.avatar });
      }

      const onInvite = (payload: VCIncomingPayload) => {
        set({
          incoming: { from: payload.from },
          peerInfo: { name: payload.from.name, avatar: payload.from.avatar },
          showCallingBadge: true,
        });
        vcPeerSocketIdRef.current = payload.from.socketId;
      };

      const onInviteAccept = async (payload: any) => {
        vcPeerSocketIdRef.current = payload.from.socketId;
        vcPendingIce.current.forEach((cand) => {
          socket.emit('webrtc:ice', { toSocketId: payload.from.socketId, candidate: cand });
        });
        vcPendingIce.current = [];

        const offer = await vcPcRef.current!.createOffer();
        await vcPcRef.current!.setLocalDescription(offer);
        socket.emit('webrtc:offer', { toSocketId: payload.from.socketId, sdp: offer, from: { id: user?.id } });
        set({ showCallingBadge: false, isDialing: false });
        vcClearCallTimeout();
      };

      const onInviteReject = () => {
        set({ incoming: null });
        get().endCall(false, 'remoteEnd');
        vcClearCallTimeout();
      };

      const onAnswer = async (payload: any) => {
        await vcPcRef.current!.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        set({ showCallingBadge: false, isDialing: false });
        vcClearCallTimeout();
      };

      const onRemoteIce = async (payload: any) => {
        if (payload.from.socketId !== vcPeerSocketIdRef.current) return;
        const candidate = new RTCIceCandidate(payload.candidate);
        if (!vcPcRef.current?.remoteDescription) {
          vcPendingIce.current.push(candidate);
          return;
        }
        try {
          await vcPcRef.current!.addIceCandidate(candidate);
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      };

      const onOffer = async (payload: any) => {
        vcPeerSocketIdRef.current = payload.from.socketId;
        set({ peerInfo: { name: payload.from.name, avatar: payload.from.avatar } });

        // Acquire based on toggles
        const { isVideoOff, isAudioMuted } = get();
        let stream: MediaStream;
        if (isVideoOff && isAudioMuted) {
          stream = new MediaStream();
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ video: !isVideoOff, audio: !isAudioMuted });
        }
        // Respect toggles
        stream.getAudioTracks().forEach((t) => (t.enabled = !isAudioMuted));
        stream.getVideoTracks().forEach((t) => (t.enabled = !isVideoOff));
        set({ localStream: stream });

        stream.getTracks().forEach((t) => {
          const sdr = vcPcRef.current!.addTrack(t, stream);
          if (t.kind === 'video') vcVideoSenderRef.current = sdr;
          if (t.kind === 'audio') vcAudioSenderRef.current = sdr;
        });

        await vcPcRef.current!.setRemoteDescription(new RTCSessionDescription(payload.sdp));

        for (const cand of vcPendingIce.current) {
          try {
            await vcPcRef.current!.addIceCandidate(cand);
          } catch (err) {
            console.error('Error adding queued ICE:', err);
          }
        }
        vcPendingIce.current = [];

        const answer = await vcPcRef.current!.createAnswer();
        await vcPcRef.current!.setLocalDescription(answer);
        socket.emit('webrtc:answer', { toSocketId: payload.from.socketId, sdp: answer, from: { id: user?.id } });
        set({ showCallingBadge: false });
      };

      const onRegistered = (info: any) => {
        if (info.id === user?.id) {
          set({ isRegistered: true });
        }
      };

      socket.on('invite', onInvite);
      socket.on('registered', onRegistered);
      socket.on('invite:accept', onInviteAccept);
      socket.on('invite:reject', onInviteReject);
      socket.on('webrtc:answer', onAnswer);
      socket.on('webrtc:ice', onRemoteIce);
      socket.on('webrtc:offer', onOffer);
      socket.on('call:end', () => {
        set({ incoming: null });
        get().endCall(false, 'remoteEnd');
      });
    },

    placeCall: async (participant) => {
      const user = authStore.getState().user;
      if (!user?.id) return;
      const socket = getVideoSocket();
      if (!vcPcRef.current) get().init();

      // Acquire media only for enabled tracks
      const { isVideoOff, isAudioMuted } = get();
      let stream: MediaStream;
      if (isVideoOff && isAudioMuted) {
        stream = new MediaStream();
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: !isVideoOff, audio: !isAudioMuted });
      }
      stream.getAudioTracks().forEach((t) => (t.enabled = !isAudioMuted));
      stream.getVideoTracks().forEach((t) => (t.enabled = !isVideoOff));
      set({
        localStream: stream,
        showCallingBadge: true,
        peerInfo: { name: participant.name, avatar: participant.avatar },
        isDialing: true,
      });

      stream.getTracks().forEach((t) => {
        const sdr = vcPcRef.current!.addTrack(t, stream);
        if (t.kind === 'video') vcVideoSenderRef.current = sdr;
        if (t.kind === 'audio') vcAudioSenderRef.current = sdr;
      });

      socket.emit('invite', { toUserId: participant.id, from: { id: user?.id } });

      vcClearCallTimeout();
      vcCallTimeoutRef.current = window.setTimeout(() => {
        set({ incoming: null });
        get().endCall(true, 'timeout');
      }, 30000);
    },

    acceptCall: async () => {
      const user = authStore.getState().user;
      const socket = getVideoSocket();
      const incoming = get().incoming;
      if (!incoming) return;

      const { isVideoOff, isAudioMuted } = get();
      let stream: MediaStream;
      if (isVideoOff && isAudioMuted) {
        stream = new MediaStream();
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: !isVideoOff, audio: !isAudioMuted });
      }
      stream.getAudioTracks().forEach((t) => (t.enabled = !isAudioMuted));
      stream.getVideoTracks().forEach((t) => (t.enabled = !isVideoOff));
      set({ localStream: stream, showCallingBadge: false });

      stream.getTracks().forEach((t) => {
        const sdr = vcPcRef.current!.addTrack(t, stream);
        if (t.kind === 'video') vcVideoSenderRef.current = sdr;
        if (t.kind === 'audio') vcAudioSenderRef.current = sdr;
      });

      // flush any pending ICE candidates
      vcPendingIce.current.forEach((cand) => {
        socket.emit('webrtc:ice', { toSocketId: vcPeerSocketIdRef.current, candidate: cand });
      });
      vcPendingIce.current = [];

      socket.emit('invite:accept', { toSocketId: incoming.from.socketId, from: { id: user?.id } });
      set({ incoming: null });
      vcClearCallTimeout();
    },

    rejectCall: async () => {
      const socket = getVideoSocket();
      const incoming = get().incoming;
      if (!incoming) return;
      socket.emit('invite:reject', { toSocketId: incoming.from.socketId });
      set({ incoming: null });
      get().endCall(false, 'localEnd');
    },

    endCall: (sendToPeer = true, reason: VCEndReason = 'localEnd') => {
      const socket = getVideoSocket();
      if (sendToPeer && vcPeerSocketIdRef.current) {
        socket.emit('call:end', { toSocketId: vcPeerSocketIdRef.current });
      }

      // Stop tracks and cleanup
      if (vcPcRef.current) {
        vcPcRef.current.getSenders().forEach((s) => {
          try {
            s.track?.stop();
          } catch {
            console.log('Error stopping track');
          }
        });
      }

      const ls = get().localStream;
      ls?.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          console.log('Error stopping local track');
        }
      });

      vcCleanupPeer();
      vcClearCallTimeout();

      set({
        localStream: null,
        remoteStream: null,
        showCallingBadge: false,
        peerInfo: null,
        incoming: null,
        isDialing: false,
      });

      if (reason === 'timeout') {
        set({ endReason: 'timeout' });
        return;
      }
    },

    toggleAudio: async () => {
      const next = !get().isAudioMuted;
      set({ isAudioMuted: next });
      const ls = get().localStream;
      if (ls) ls.getAudioTracks().forEach((t) => (t.enabled = !next));
      if (vcPcRef.current) vcPcRef.current.getSenders().forEach((s) => {
        if (s.track?.kind === 'audio') s.track.enabled = !next;
      });
    },

    toggleVideo: async () => {
      const next = !get().isVideoOff;
      set({ isVideoOff: next });
      const ls = get().localStream;
      if (!vcPcRef.current) return;

      if (next) {
        // Turning video OFF
        if (vcVideoSenderRef.current) {
          try {
            await vcVideoSenderRef.current.replaceTrack(null);
          } catch {
          }
        }
        if (ls) {
          ls.getVideoTracks().forEach((t) => {
            try {
              t.stop();
            } catch {
            }
            ls.removeTrack(t);
          });
          set({ localStream: ls });
        }
      } else {
        try {
          const cam = await navigator.mediaDevices.getUserMedia({ video: true });
          const [newTrack] = cam.getVideoTracks();
          if (!newTrack) return;
          const newStream = ls ?? new MediaStream();
          newStream.addTrack(newTrack);
          set({ localStream: newStream });
          if (vcVideoSenderRef.current) {
            await vcVideoSenderRef.current.replaceTrack(newTrack);
          } else {
            vcVideoSenderRef.current = vcPcRef.current.addTrack(newTrack, newStream);
          }
        } catch (e) {
          console.error('Error re-enabling camera:', e);
          set({ isVideoOff: true });
        }
      }
    },

    clearEndReason: () => set({ endReason: null }),
  };
};

export const useVideoCallStore = create<VideoCallState>()(
  devtools(
    videoStore,
    { name: 'video-store', enabled: true },
  ),
);

export default useVideoCallStore;
