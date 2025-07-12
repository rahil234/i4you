import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthenticatedSocket } from '../types/authenticated-socket';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    server.use((socket, next) => {
      const userId = socket.handshake.headers['x-user-id'] as string;
      const userRole = socket.handshake.headers['x-user-role'] as string;
      if (!userId || !userRole) {
        return next(
          new Error('Missing x-user-id header or x-user-role header'),
        );
      }
      (socket as AuthenticatedSocket).user = { id: userId, role: userRole };
      next();
    });
  }

  @SubscribeMessage('join')
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // @SubscribeMessage('createRoom')
  // async handleCreateRoom(
  //   @ConnectedSocket() client: AuthenticatedSocket,
  //   @MessageBody('chatId') chatId: string,
  //   @Headers('x-user-id') userId: string,
  // ) {
  //   console.log('User1:', userId, 'User2:', chatId);
  //
  //   let chat = await this.chatService.findChatByParticipants(userId, chatId);
  //
  //   if (!chat) {
  //     console.log('Creating new chat for participants:', userId, chatId);
  //     chat = await this.chatService.createChat({
  //       participants: [userId, chatId],
  //       messages: [],
  //     });
  //   } else {
  //     console.log('Chat already exists:', chat);
  //   }
  //
  //   await client.join(chat._id);
  //   client.emit('joinedRoom', `You have joined room: ${chat._id}`);
  //   this.server.to(chat._id).emit('roomMessage', {
  //     sender: 'System',
  //     message: `${client.id} has joined the room.`,
  //   });
  //
  //   console.log(`Client ${client.id} joined chat room: ${chat.id}`);
  // }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ) {
    const userId = client.handshake.headers['x-user-id'] as string;

    let chat = await this.chatService.FindChatById(chatId);

    if (!chat) {
      console.log('Creating new chat for user:', userId, 'and chatId:', chatId);
      chat = await this.chatService.createChat({
        participants: [userId, chatId],
        messages: [],
      });
    }

    await client.join(chat._id.toString());

    client.emit('joinedRoom', `You have joined room: ${chat._id.toString()}`);

    client.to(chat._id.toString()).emit('roomMessage', {
      sender: 'System',
      message: `${userId} has joined the room.`,
    });
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

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      content: string;
      chatId: string;
      newChat?: boolean;
    },
  ): Promise<void> {
    if (!payload.chatId || !payload.content) {
      console.error('Invalid message payload:', payload);
      return;
    }
    const userId = client.handshake.headers['x-user-id'] as string;

    if (payload.newChat) {
      console.log('Creating new chat for message:', payload);
      const chat = await this.chatService.createChat({
        participants: [userId, payload.chatId],
        messages: [],
      });
      client.emit('newChat', chat);
    }

    console.log('Received message:', payload);
    client.to(payload.chatId).emit('message', {
      ...payload,
      sender: userId,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    payload: {
      chatId: string;
      isTyping: boolean;
    },
    @ConnectedSocket() socket: Socket,
  ): void {
    const userId = socket.handshake.headers['x-user-id'] as string;

    socket.to(payload.chatId).emit('typing', {
      sender: userId,
      isTyping: payload.isTyping,
    });
  }
}
