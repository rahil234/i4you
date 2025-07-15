import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document<Types.ObjectId> {
  @Prop({ type: [String], required: true })
  participants: string[];

  @Prop({
    type: Object,
    default: null,
  })
  lastMessage?: {
    sender: string;
    content: string;
    timestamp: string;
  };
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
