import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    console.log(`User ${userId} joined the chat`);
    this.users.set(userId, client.id);
    console.log(this.users);
    client.emit('joined', `User ${userId} joined the chat`);
  }

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: any) {
    // console.log(`Sending message from  to ${receiver}: ${message}`);
    // const receiverSocketId = this.users.get(receiver);

    // if (receiverSocketId) {
    //   console.log(receiverSocketId);
    //   this.server.to(receiverSocketId).emit('receive_message', { message });
    // }
    console.log(data);
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
