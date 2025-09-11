import { Inject, Injectable } from '@nestjs/common';
import { User } from '@i4you/shared';

import { ChatResponseDto } from '../dto/get-chat.dto.js';
import { UserResponseDto } from '../dto/get-user.dto.js';
import { IChatRepository } from '../repositories/interfaces/chat.repository.interface';
import { IMessageRepository } from '../repositories/interfaces/message.repository.interface';
import { IUserService } from '../../user/interfaces/IUserService';
import { Message } from '../../types';
import { IChatService } from './interfaces/IChatService';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject('ChatRepository') private readonly _chatRepository: IChatRepository,
    @Inject('MessageRepository')
    private readonly _messageRepository: IMessageRepository,
    @Inject('UserService') private readonly _userService: IUserService,
  ) {}

  async findChatById(chatId: string): Promise<Chat | null> {
    return this._chatRepository.findById(chatId);
  }

  async findChatsByUserId(userId: string) {
    const chats = await this._chatRepository.findByUser(userId);

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.participants.find((id) => id !== userId);

        if (!otherUserId) return;

        const user = (await this._userService.getUserById(
          otherUserId,
        )) as unknown as User;

        const lastMessage = await this._messageRepository.findLastMessage(
          chat.id,
        );

        const unreadCount = await this._messageRepository.countUnreadMessages(
          chat.id,
          userId,
        );

        console.log('Unread count:', unreadCount);

        if (!user) {
          console.warn(`User with ID ${otherUserId} not found`);
          throw new Error('Cannot find user from grpc service');
        }

        // @ts-expect-error -- lastMessage can be null
        return new ChatResponseDto(chat, user, lastMessage, unreadCount);
      }),
    );

    return enrichedChats.filter(Boolean);
  }

  async getInitialChatUser(userId: string) {
    const user = (await this._userService.getUserById(
      userId,
    )) as unknown as User;

    return new UserResponseDto(user);
  }

  async findChatByParticipants(userA: string, userB: string) {
    return this._chatRepository.findByParticipants(userA, userB);
  }

  async createChat(userA: string, userB: string) {
    return this._chatRepository.create([userA, userB]);
  }

  async createMessage({ chatId, sender, content, timestamp }: Message) {
    const message = await this._messageRepository.create(
      chatId,
      sender,
      content,
      timestamp,
    );

    // Optional: Update chat's last message summary or timestamp
    await this._chatRepository.updateLastMessage(chatId, {
      sender,
      content,
      timestamp: new Date().toISOString(),
    });

    return message;
  }

  async getMessages(chatId: string, page = 0, limit = 20) {
    return this._messageRepository.findByChatId(chatId, page, limit);
  }

  async markMessagesAsDelivered(chatId: string, userId?: string) {
    return this._messageRepository.markAsDelivered(chatId, userId);
  }

  async markMessagesAsRead(chatId: string, userId?: string) {
    return this._messageRepository.markAsRead(chatId, userId);
  }
}
