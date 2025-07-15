import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { MessageResponseDto } from './dto/message.response.dto';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/')
  getChats(@Headers('x-user-id') userId: string): Promise<any> {
    return this.chatService.findChatsByUserId(userId);
  }

  @Get('/user/:userId')
  getInitialChatUser(@Param('userId') userId: string): Promise<any> {
    return this.chatService.getInitialChatUser(userId);
  }

  @Get('/chat/:chatId')
  getChatById(@Param('chatId') chatId: string): Promise<any> {
    return this.chatService.findChatById(chatId);
  }

  @Get('/:chatId/messages')
  async getMessagesByUserId(
    @Param('chatId') chatId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 0,
  ): Promise<any> {
    const messages = await this.chatService.getMessages(chatId, page, limit);
    return {
      messages: messages.map((m) => new MessageResponseDto(m)),
      page,
      total: messages.length,
      hasNextPage: messages.length >= limit,
    };
  }
}
