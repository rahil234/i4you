import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from '../schemas/message.schema.js';
import { Message } from '../entities/message.entity.js';
import { IMessageRepository } from './interfaces/message.repository.interface.js';
import { MessageMapper } from '../mappers/message.mapper.js';

export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(Message.name)
    private _messageModel: Model<MessageDocument>,
  ) {}

  async create(
    chatId: string,
    sender: string,
    content: string,
    timestamp: number,
  ): Promise<Message> {
    const doc = await this._messageModel.create({
      chatId,
      sender,
      content,
      timestamp,
      status: 'sent',
    });
    return MessageMapper.toDomain(doc);
  }

  async findByChatId(chatId: string, page = 0, limit = 20): Promise<Message[]> {
    const docs = await this._messageModel
      .find({ chatId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .exec();

    return docs.map((d) => MessageMapper.toDomain(d));
  }

  async findLastMessage(chatId: string): Promise<Message | null> {
    const doc = await this._messageModel
      .findOne({ chatId })
      .sort({ createdAt: -1 })
      .exec();

    if (!doc) return null;

    return MessageMapper.toDomain(doc);
  }

  async countUnreadMessages(chatId: string, userId?: string): Promise<number> {
    return this._messageModel
      .countDocuments({
        chatId,
        status: { $ne: 'read' },
        sender: { $ne: userId },
      })
      .exec();
  }

  async markAsDelivered(chatId: string, userId?: string): Promise<void> {
    await this._messageModel.updateMany(
      { chatId, status: { $ne: 'delivered' }, sender: { $ne: userId } },
      { status: 'delivered' },
    );
  }

  async markAsRead(chatId: string, userId?: string): Promise<void> {
    await this._messageModel.updateMany(
      { chatId, status: { $ne: 'read' }, sender: { $ne: userId } },
      { status: 'read' },
    );
  }
}
