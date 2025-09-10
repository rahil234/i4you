import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface UserInfo {
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

@WebSocketGateway({
  cors: {
    origin: ['https://i4you.local.net'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private userIdToInfo = new Map<string, UserInfo>();
  private socketIdToUserId = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketIdToUserId.get(client.id);
    if (userId) {
      this.userIdToInfo.delete(userId);
      this.socketIdToUserId.delete(client.id);
      console.log(`User disconnected: ${userId}`);
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    client: Socket,
    payload: { name: string; id: string; avatar?: string },
  ) {
    const info: UserInfo = {
      socketId: client.id,
      name: payload.name,
      id: payload.id,
      avatar: payload.avatar || '',
    };
    this.userIdToInfo.set(payload.id, info);
    this.socketIdToUserId.set(client.id, payload.id);
    console.log(`User registered: ${payload.id}`);
    client.emit('registered', info);
  }

  @SubscribeMessage('invite')
  handleInvite(
    client: Socket,
    payload: { from: { id: string }; toUserId: string },
  ) {
    const from = this.userIdToInfo.get(payload.from.id);
    if (!from) return;

    const toInfo = this.userIdToInfo.get(payload.toUserId);
    if (toInfo) {
      client.to(toInfo.socketId).emit('invite', {
        from,
        toSocketId: toInfo.socketId,
      });
    } else {
      client.emit('invite:failed', { reason: 'User not connected' });
    }
  }

  @SubscribeMessage('invite:accept')
  handleAccept(
    client: Socket,
    payload: { toSocketId: string; from: { id: string } },
  ) {
    const from = this.userIdToInfo.get(payload.from.id);
    if (!from) return;
    client
      .to(payload.toSocketId)
      .emit('invite:accept', { from, toSocketId: payload.toSocketId });
  }

  @SubscribeMessage('invite:reject')
  handleReject(
    client: Socket,
    payload: { toSocketId: string; reason?: string },
  ) {
    const userId = this.socketIdToUserId.get(client.id);
    if (!userId) return;
    const from = this.userIdToInfo.get(userId);
    if (!from) return;
    client.to(payload.toSocketId).emit('invite:reject', {
      from,
      toSocketId: payload.toSocketId,
      reason: payload.reason,
    });
  }

  @SubscribeMessage('webrtc:offer')
  handleOffer(
    client: Socket,
    payload: { toSocketId: string; sdp: WebRtcSdp; from: { id: string } },
  ) {
    const from = this.userIdToInfo.get(payload.from.id);
    if (!from) return;
    client.to(payload.toSocketId).emit('webrtc:offer', {
      from,
      toSocketId: payload.toSocketId,
      sdp: payload.sdp,
    });
  }

  @SubscribeMessage('webrtc:answer')
  handleAnswer(
    client: Socket,
    payload: { toSocketId: string; sdp: WebRtcSdp; from: { id: string } },
  ) {
    const from = this.userIdToInfo.get(payload.from.id);
    if (!from) return;
    client.to(payload.toSocketId).emit('webrtc:answer', {
      from,
      toSocketId: payload.toSocketId,
      sdp: payload.sdp,
    });
  }

  @SubscribeMessage('webrtc:ice')
  handleIce(
    client: Socket,
    payload: { toSocketId: string; candidate: WebRtcIceCandidate },
  ) {
    const userId = this.socketIdToUserId.get(client.id);
    if (!userId) return;
    const from = this.userIdToInfo.get(userId);
    if (!from) return;
    client.to(payload.toSocketId).emit('webrtc:ice', {
      from,
      toSocketId: payload.toSocketId,
      candidate: payload.candidate,
    });
  }

  @SubscribeMessage('call:end')
  handleEndCall(client: Socket, payload: { toSocketId: string }) {
    client.to(payload.toSocketId).emit('call:end');
  }
}
