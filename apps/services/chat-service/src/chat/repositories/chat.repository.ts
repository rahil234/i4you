import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../schemas/chat.schema.js';
import { IChatRepository } from './interfaces/chat.repository.interface.js';

export class ChatRepository implements IChatRepository {
  constructor(@InjectModel(Chat.name) private _chatModel: Model<Chat>) {}

  async create(participants: string[]) {
    const chat = new this._chatModel({ participants });
    return chat.save();
  }

  async findById(chatId: string) {
    return this._chatModel.findById(chatId);
  }

  async findByUser(userId: string) {
    return this._chatModel.find({
      participants: { $in: [userId] },
    });
  }

  async findByParticipants(userA: string, userB: string) {
    return this._chatModel.findOne({
      participants: { $all: [userA, userB], $size: 2 },
    });
  }

  async updateLastMessage(
    chatId: string,
    message: { sender: string; content: string; timestamp: string },
  ) {
    await this._chatModel.findByIdAndUpdate(chatId, {
      lastMessage: message,
      updatedAt: new Date(),
    });
  }
}
