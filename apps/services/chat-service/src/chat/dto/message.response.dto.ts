import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Message } from '../schemas/message.schema';

export class MessageResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  timestamp: number;

  constructor(message: Message) {
    this.id = message._id.toString();
    this.chatId = message.chatId;
    this.sender = message.sender;
    this.content = message.content;
    this.status = message.status;
    this.timestamp = new Date(message.createdAt).getTime();
  }
}
