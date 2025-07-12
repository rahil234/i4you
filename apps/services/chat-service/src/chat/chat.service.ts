import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@i4you/shared';

import { UserGrpcService } from '../user/user.grpc.service';
import { ChatResponseDto } from '../dto/get-chat.dto';
import { Chat } from './schemas/chat.schema';
import { UserResponseDto } from '../dto/get-user.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly userGrpcService: UserGrpcService,
  ) {}

  async FindChatById(chatId: string) {
    console.log('Finding chat by ID:', chatId);
    return this.chatModel.findById(chatId);
  }

  async findChatsByUserId(userId: string) {
    const chats = await this.chatModel.find({
      participants: { $in: [userId] },
    });

    console.log('Found chats for user:', userId, 'Chats:', chats);

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.participants.find((id) => id !== userId);

        let user: User | null = null;

        if (otherUserId) {
          const response = await this.userGrpcService.getUserById(otherUserId);

          if (!response.user) {
            console.warn(`User with ID ${otherUserId} not found`);
            throw new Error('Cannot find user from grpc service');
          }

          user = response.user as unknown as User;

          if (!user) {
            console.warn(
              `User with ID ${otherUserId} not found, using default`,
            );
            throw new Error('Cannot find user from grpc service');
          }

          return new ChatResponseDto(chat, user);
        }
      }),
    );

    return enrichedChats;
  }

  async getInitialChatUser(userId: string) {
    console.log('Getting initial chat user for user ID:', userId);
    const user = (await this.userGrpcService.getUserById(userId))
      .user as unknown as User;

    console.log('Initial chat user:', user);

    return new UserResponseDto(user);
  }

  async findChatByParticipants(user1: string, user2: string) {
    console.log('Finding chat by participants:', user1, user2);
    return this.chatModel.findOne({
      participants: { $all: [user1, user2], $size: 2 },
    });
  }

  async createChat(data: Partial<Chat>) {
    return this.chatModel.create(data);
  }

  async addMessage(chatId: string, message) {
    return this.chatModel.updateOne(
      { id: chatId },
      { $push: { messages: message } },
    );
  }
}
