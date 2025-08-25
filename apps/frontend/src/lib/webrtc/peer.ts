export async function createPeerConnection(
    localStream: MediaStream,
    onRemoteStream: (stream: MediaStream) => void,
    onIceCandidate: (candidate: RTCIceCandidate) => void
) {
    const pc = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ],
    });

    // add local tracks
    for (const track of localStream.getTracks()) {
        pc.addTrack(track, localStream);
    }

    // remote tracks
    pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) onRemoteStream(remoteStream);
    };

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            onIceCandidate(event.candidate);
        }
    };

    return pc;
}

export async function createOffer(pc: RTCPeerConnection) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
}

export async function createAnswer(pc: RTCPeerConnection, remoteSdp: RTCSessionDescriptionInit) {
    await pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
}

export async function setRemoteAnswer(pc: RTCPeerConnection, remoteSdp: RTCSessionDescriptionInit) {
    await pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
}

export async function addRemoteIce(pc: RTCPeerConnection, candidate: RTCIceCandidateInit) {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
}
