import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  providers: [ChatGateway],
})
export class AppModule {}
