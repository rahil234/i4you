import { Controller, Get, Headers, Inject, Param, Query } from '@nestjs/common';
import { MessageResponseDto } from '../dto/message.response.dto.js';
import { IChatService } from '../services/interfaces/IChatService';

@Controller()
export class ChatController {
  constructor(
    @Inject('ChatService') private readonly chatService: IChatService,
  ) {}

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
