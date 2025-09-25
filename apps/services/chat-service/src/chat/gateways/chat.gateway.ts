import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Server, Socket } from 'socket.io';

import { User } from '@i4you/shared';

import { AuthenticatedSocket } from '../../types/authenticated-socket.js';
import { MessageRequestDto } from '../dto/message.request.dto.js';
import { ChatResponseDto } from '../dto/get-chat.dto.js';
import { MessageResponseDto } from '../dto/message.response.dto.js';
import { IUserService } from '../../user/interfaces/IUserService.js';
import { IChatService } from '../services/interfaces/IChatService.js';
import { Message } from '../entities/message.entity.js';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('ChatService')
    private readonly _chatService: IChatService,
    @Inject('UserService') private readonly _userService: IUserService,
    @Inject('KAFKA_SERVICE') private readonly _kafkaService: ClientKafka,
  ) {}

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

  handleConnection(socket: AuthenticatedSocket) {
    console.log('Client connected:', socket.id);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('Client disconnected:', socket.id);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody('newUserId') newUserId: string,
    @MessageBody('message') message: { content: string; timestamp: string },
  ) {
    let chat = await this._chatService.findChatByParticipants(
      socket.user.id,
      newUserId,
    );

    let newMessage: Message | null = null;

    if (!chat) {
      console.log(
        'Creating new chat for participants:',
        socket.user.id,
        newUserId,
      );

      chat = await this._chatService.createChat(socket.user.id, newUserId);

      newMessage = await this._chatService.createMessage({
        chatId: chat._id.toString(),
        sender: socket.user.id,
        content: message.content,
        timestamp: Number(message.timestamp) || Date.now(),
      });
    } else {
      console.log('Chat already exists:', chat);
    }

    const otherUser = (await this._userService.getUserById(
      newUserId,
    )) as unknown as User;

    const user = (await this._userService.getUserById(
      socket.user.id,
    )) as unknown as User;

    if (!user || !otherUser) {
      console.error('User or Other user not found:', [
        newUserId,
        socket.user.id,
      ]);
      return;
    }

    socket.emit('newChat', new ChatResponseDto(chat, otherUser, null));

    if (newMessage) {
      this._kafkaService.emit('chat.events', {
        type: 'NEW_CHAT',
        recipientId: newUserId,
        data: {
          chat: new ChatResponseDto(chat, user, null),
          message: new MessageResponseDto(newMessage),
        },
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() chatId: string,
  ) {
    const userId = socket.user.id;

    const chat = await this._chatService.findChatById(chatId);

    if (!chat) {
      console.log('Creating new chat for user:', userId, 'and chatId:', chatId);
      throw new Error('Chat not found');
    }

    await socket.join(chat._id.toString());

    socket.emit('joinedRoom', `You have joined room: ${chat._id.toString()}`);

    socket.to(chat._id.toString()).emit('roomMessage', {
      sender: 'System',
      message: `${userId} has joined the room.`,
    });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('room') room: string,
  ) {
    await socket.leave(room);
    socket.emit('leftRoom', `You have left room: ${room}`);
    this.server.to(room).emit('roomMessage', {
      sender: 'System',
      message: `${socket.id} has left the room ${room}`,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: MessageRequestDto,
  ) {
    const timestamp = payload.timestamp;

    const chat = await this._chatService.findChatById(payload.chatId);

    if (!chat) {
      console.error('Chat not found:', payload.chatId);
      return;
    }

    const otherUserId = chat.participants.find((id) => id !== socket.user.id)!;

    const newMessage = await this._chatService.createMessage({
      chatId: payload.chatId,
      sender: socket.user.id,
      content: payload.content,
      timestamp: timestamp,
    });

    const isRecipientConnected = true;

    if (!isRecipientConnected) {
      this._kafkaService.emit('chat.events', {
        type: 'NEW_MESSAGE',
        recipientId: otherUserId,
        data: new MessageResponseDto(newMessage),
      });
      return;
    }

    this.server.to(payload.chatId).emit('message', {
      ...payload,
      sender: socket.user.id,
      timestamp,
    });
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody('chatId') chatId: string,
    @MessageBody('page') page: number,
  ) {
    const messages = await this._chatService.getMessages(chatId, page);
    socket.emit('messagesPage', { chatId, page, messages });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    payload: {
      chatId: string;
      isTyping: boolean;
    },
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const userId = socket.user.id;

    socket.to(payload.chatId).emit('typing', {
      sender: userId,
      isTyping: payload.isTyping,
    });
  }

  @SubscribeMessage('read_receipt')
  async handleReadReceipt(
    @MessageBody()
    payload: { chatId: string },
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const userId = socket.user.id;

    socket.to(payload.chatId).emit('read_receipt', {
      sender: userId,
      chatId: payload.chatId,
    });

    await this._chatService.markMessagesAsRead(payload.chatId, userId);
  }

  @SubscribeMessage('delivered_receipt')
  async handleDeliveredReceipt(
    @MessageBody()
    payload: { chatId: string },
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const userId = socket.user.id;

    socket.to(payload.chatId).emit('delivered_receipt', {
      sender: userId,
      chatId: payload.chatId,
    });

    await this._chatService.markMessagesAsDelivered(payload.chatId, userId);
  }
}
