export interface UserInfo {
  socketId: string;
  name: string;
  id: string;
  avatar: string;
}

export interface WebRtcSdp {
  type: 'offer' | 'answer';
  sdp: string;
}

export interface WebRtcIceCandidate {
  candidate: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
}
