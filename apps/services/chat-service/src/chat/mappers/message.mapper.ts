import { Message } from '../entities/message.entity.js';
import { MessageDocument } from '../schemas/message.schema.js';

export class MessageMapper {
  static toDomain(doc: MessageDocument): Message {
    return new Message(
      doc._id.toString(),
      doc.chatId,
      doc.sender,
      doc.content,
      doc.timestamp,
      doc.status,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toPersistence(entity: Message) {
    return {
      _id: entity.id,
      chatId: entity.chatId,
      sender: entity.sender,
      content: entity.content,
      timestamp: entity.timestamp,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
