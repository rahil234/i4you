import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message {
  @Prop()
  senderId: string;

  @Prop()
  message: string;

  @Prop()
  timestamp: string;

  @Prop({ type: [String] })
  seenBy: string[];
}

@Schema()
export class Chat extends Document<Types.ObjectId> {
  @Prop()
  chatId: string;

  @Prop({ type: [String], required: true, unique: true })
  participants: string[];

  @Prop({ type: [Message] })
  messages: Message[];

  @Prop({ type: [Date], required: true })
  lastActive: Date;

  @Prop({ type: [Boolean], required: true })
  isActive: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
