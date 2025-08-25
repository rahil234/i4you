'use client';

import React, { useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff as VideoOffIcon } from 'lucide-react';
import { CallIncoming } from '@/components/user/CallIncoming';
import { useVideoCallStore } from '@/store/videoStore';
import { useRouter } from 'next/navigation';

export default function VideoCall() {
  const router = useRouter();
  const {
    localStream,
    remoteStream,
    incoming,
    isAudioMuted,
    isVideoOff,
    showCallingBadge,
    peerInfo,
    endReason,
    isDialing,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    clearEndReason,
  } = useVideoCallStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const dialingAudioRef = useRef<HTMLAudioElement>(null);

  // Attach streams to video elements only when in call
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = localStream ?? null;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream ?? null;
  }, [remoteStream]);

  // Show full-screen overlay only when in-call
  const inCall = !!(remoteStream || (localStream && (localStream.getTracks().length > 0)));

  if (!incoming && !inCall && !endReason && !isDialing) return null;

  return (
    <>
      {/* Mini incoming bar always available when ringing */}
      <CallIncoming incoming={incoming} acceptCall={acceptCall} rejectCall={rejectCall} />

      {/* Outgoing dialing audio (no UI) */}
      {isDialing && (
        <audio ref={dialingAudioRef} loop autoPlay>
          <source src="/sounds/call-dialing.mp3" type="audio/mpeg" />
        </audio>
      )}

      {/* Post-timeout panel requiring user action */}
      {endReason === 'timeout' && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center">
          <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-5 rounded-xl shadow-lg text-center space-y-3">
            <div className="text-lg font-semibold">Call not answered</div>
            <div className="text-sm text-white/80">The call was not accepted. You can try again later.</div>
            <div className="pt-2">
              <button
                onClick={() => {
                  clearEndReason();
                  router.back();
                }}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90"
              >
                Back to chats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full video call overlay only when in-call */}
      {inCall && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          {/* Top overlay with caller/callee name while calling */}
          {showCallingBadge && (
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-center z-50 pointer-events-none">
              <div className="bg-black/40 text-white px-4 py-2 rounded-full text-sm sm:text-base font-medium">
                {peerInfo?.name ? `Video calling • ${peerInfo.name}` : 'Video calling'}
              </div>
            </div>
          )}

          {/* Remote video OR black fallback */}
          {remoteStream && remoteStream.getTracks().length > 0 ? (
            remoteStream.getVideoTracks()[0]?.enabled ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full bg-black flex items-center justify-center text-white text-lg">
                Video paused
              </div>
            )
          ) : (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center text-white">
              Connecting…
            </div>
          )}

          {/* Local video OR fallback */}
          {localStream && localStream.getTracks().length > 0 ? (
            localStream.getVideoTracks()[0]?.enabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-4 right-4 w-32 h-32 object-cover rounded-lg border-2 border-white"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <div
                className="absolute bottom-4 right-4 w-32 h-32 rounded-lg border-2 border-white bg-black flex items-center justify-center text-xs text-white">
                Camera paused
              </div>
            )
          ) : (
            <div
              className="absolute bottom-4 right-4 w-32 h-32 rounded-lg border-2 border-white bg-black flex items-center justify-center text-xs text-white">
              Camera off
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-8 flex items-center gap-4">
            <button
              onClick={toggleAudio}
              aria-label={isAudioMuted ? 'Unmute microphone' : 'Mute microphone'}
              className={`p-4 rounded-full ${isAudioMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isAudioMuted ? <MicOff /> : <Mic />}
            </button>
            <button
              onClick={toggleVideo}
              aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
              className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isVideoOff ? <VideoOffIcon /> : <VideoIcon />}
            </button>
            <button onClick={() => endCall(true)} className="bg-red-500 p-4 rounded-full" aria-label="End call">
              <PhoneOff />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
