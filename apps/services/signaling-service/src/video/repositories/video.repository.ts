import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema.js';

export class VideoRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(
    chatId: string,
    sender: string,
    content: string,
    timestamp: number,
  ) {
    return this.messageModel.create({
      chatId,
      sender,
      content,
      timestamp: timestamp,
      status: 'sent',
    });
  }

  async findByChatId(chatId: string, page = 0, limit = 20) {
    return this.messageModel
      .find({ chatId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
  }

  async markAsDelivered(chatId: string, userId?: string) {
    return this.messageModel.updateMany(
      { chatId, status: { $ne: 'delivered' }, sender: { $ne: userId } },
      { status: 'delivered' },
    );
  }

  async markAsRead(chatId: string, userId?: string) {
    return this.messageModel.updateMany(
      { chatId, status: { $ne: 'read' }, sender: { $ne: userId } },
      { status: 'read' },
    );
  }
}
