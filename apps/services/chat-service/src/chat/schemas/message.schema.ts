import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class MessageDocument extends Document<Types.ObjectId> {
  @Prop({ type: String, required: true })
  chatId: string;

  @Prop({ type: String, required: true })
  sender: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, required: true })
  timestamp: number;

  @Prop({ type: String, default: 'sent' })
  status: 'sent' | 'delivered' | 'read';

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);
