import { Controller, Get } from '@nestjs/common';
import { SignalingService } from './services/signaling.service.js';

@Controller()
export class SignalingController {
  constructor(private readonly chatService: SignalingService) {}

  @Get('/:chatId/messages')
  getMessagesByUserId(): void {
    return;
  }
}
