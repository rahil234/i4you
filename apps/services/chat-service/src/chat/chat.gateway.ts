import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Join a room
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string) {
    console.log('Client', client.id, 'joining room', room);
    await client.join(room);
    console.log('client joined room', room);
    client.emit('joinedRoom', `You have joined room: ${room}`);
    console.log('client emited romm', room);
    client.to(room).emit('roomMessage', {
      sender: 'System',
      message: `${client.id} has joined the room ${room}`,
    });
  }

  // Leave a room
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, room: string) {
    await client.leave(room);
    client.emit('leftRoom', `You have left room: ${room}`);
    this.server.to(room).emit('roomMessage', {
      sender: 'System',
      message: `${client.id} has left the room ${room}`,
    });
  }

  // Send message to a specific room
  @SubscribeMessage('roomMessage')
  handleRoomMessage(
    client: Socket,
    payload: { room: string; sender: string; message: string },
  ): void {
    this.server.to(payload.room).emit('roomMessage', {
      sender: payload.sender,
      message: payload.message,
    });
  }

  // Broadcast to all (optional, from previous example)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      sender: string;
      message: string;
    },
  ): void {
    console.log('Received message:', payload);
    client.emit('message', payload);
  }
}
