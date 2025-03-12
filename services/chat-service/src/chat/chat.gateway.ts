import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Enable CORS
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>(); // Stores userId -> socketId mapping

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    console.log(`User ${userId} joined the chat`);
    this.users.set(userId, client.id);
    client.emit('joined', `User ${userId} joined the chat`);
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody() data: { sender: string; receiver: string; message: string },
  ) {
    const { sender, receiver, message } = data;
    console.log(`Sending message from ${sender} to ${receiver}: ${message}`);
    const receiverSocketId = this.users.get(receiver);

    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit('receive_message', { sender, message });
    }
  }

  @SubscribeMessage('connect')
  handleConnect(
    @MessageBody() data: { sender: string; receiver: string; message: string },
  ) {
    const { sender, receiver, message } = data;
    console.log(`Sending message from ${sender} to ${receiver}: ${message}`);
    const receiverSocketId = this.users.get(receiver);

    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit('receive_message', { sender, message });
    }
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.users.delete(userId);
      }
    });
  }
}
