import { Injectable } from '@nestjs/common';
import { User } from '@i4you/shared';

import { ChatRepository } from '../repositories/chat.repository.js';
import { MessageRepository } from '../repositories/message.repository.js';
import { UserGrpcService } from '../../user/user.grpc.service.js';

import { ChatResponseDto } from '../dto/get-chat.dto.js';
import { UserResponseDto } from '../dto/get-user.dto.js';

interface Message {
  chatId: string;
  sender: string;
  content: string;
  timestamp: number;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userGrpcService: UserGrpcService,
  ) {}

  async findChatById(chatId: string) {
    return this.chatRepository.findById(chatId);
  }

  async findChatsByUserId(userId: string) {
    const chats = await this.chatRepository.findByUser(userId);

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.participants.find((id) => id !== userId);

        if (!otherUserId) return;

        const response = await this.userGrpcService.getUserById(otherUserId);
        const user = response as unknown as User;

        if (!user) {
          console.warn(`User with ID ${otherUserId} not found`);
          throw new Error('Cannot find user from grpc service');
        }

        return new ChatResponseDto(chat, user);
      }),
    );

    return enrichedChats.filter(Boolean);
  }

  async getInitialChatUser(userId: string) {
    const user = (await this.userGrpcService.getUserById(
      userId,
    )) as unknown as User;

    return new UserResponseDto(user);
  }

  async findChatByParticipants(userA: string, userB: string) {
    return this.chatRepository.findByParticipants(userA, userB);
  }

  async createChat(userA: string, userB: string) {
    return this.chatRepository.create([userA, userB]);
  }

  async createMessage({ chatId, sender, content, timestamp }: Message) {
    const message = await this.messageRepository.create(
      chatId,
      sender,
      content,
      timestamp,
    );

    // Optional: Update chat's last message summary or timestamp
    await this.chatRepository.updateLastMessage(chatId, {
      sender,
      content,
      timestamp: new Date().toISOString(),
    });

    return message;
  }

  async getMessages(chatId: string, page = 0, limit = 20) {
    return this.messageRepository.findByChatId(chatId, page, limit);
  }

  async markMessagesAsDelivered(chatId: string, userId?: string) {
    return this.messageRepository.markAsDelivered(chatId, userId);
  }

  async markMessagesAsRead(chatId: string, userId?: string) {
    return this.messageRepository.markAsRead(chatId, userId);
  }
}
