import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

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
