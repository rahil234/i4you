export interface CallOffer {
  from: string; // caller userId
  to: string; // receiver userId
  offer: RTCSessionDescriptionInit;
}

export interface CallAnswer {
  from: string;
  to: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  from: string;
  to: string;
  candidate: RTCIceCandidateInit;
}
