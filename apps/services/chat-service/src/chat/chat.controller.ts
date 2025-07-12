import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

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
}
