import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() user2: string,
  ) {
    const user1 = client.handshake.headers['x-user-id'] as string;

    console.log('User1:', user1, 'User2:', user2);

    let chat = await this.chatService.findChatByParticipants(user1, user2);

    if (!chat) {
      console.log('Creating new chat for participants:', user1, user2);
      chat = await this.chatService.createChat({
        participants: [user1, user2],
        messages: [],
      });
    } else {
      console.log('Chat already exists:', chat);
    }

    await client.join(chat._id);
    client.emit('joinedRoom', `You have joined room: ${chat._id}`);
    this.server.to(chat._id).emit('roomMessage', {
      sender: 'System',
      message: `${client.id} has joined the room.`,
    });

    console.log(`Client ${client.id} joined chat room: ${chat.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() user2: string,
  ) {
    const user1 = client.handshake.headers['x-user-id'] as string;

    console.log('User1:', user1, 'User2:', user2);

    let chat = await this.chatService.findChatByParticipants(user1, user2);

    if (!chat) {
      console.log('Creating new chat for participants:', user1, user2);
      chat = await this.chatService.createChat({
        participants: [user1, user2],
        messages: [],
      });
    } else {
      console.log('Chat already exists:', chat);
    }

    await client.join(chat._id);
    client.emit('joinedRoom', `You have joined room: ${chat._id}`);
    this.server.to(chat._id).emit('roomMessage', {
      sender: 'System',
      message: `${client.id} has joined the room.`,
    });

    console.log(`Client ${client.id} joined chat room: ${chat.id}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, room: string) {
    await client.leave(room);
    client.emit('leftRoom', `You have left room: ${room}`);
    this.server.to(room).emit('roomMessage', {
      sender: 'System',
      message: `${client.id} has left the room ${room}`,
    });
  }

  // Send a message to a specific room
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

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      sender: string;
      message: string;
      chatId: string;
    },
  ): void {
    console.log('Received message:', payload);
    client.to(payload.chatId).emit('message', payload);
  }
}
