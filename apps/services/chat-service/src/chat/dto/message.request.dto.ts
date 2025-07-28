import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class MessageRequestDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsNumber()
  timestamp: number;
}
