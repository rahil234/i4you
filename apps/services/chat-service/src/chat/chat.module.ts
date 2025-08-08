import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Chat, ChatSchema } from './schemas/chat.schema.js';
import { ChatGateway } from './chat.gateway.js';
import { ChatService } from './services/chat.service.js';
import { ChatController } from './chat.controller.js';
import { UserModule } from '../user/user.module.js';
import { Message, MessageSchema } from './schemas/message.schema.js';
import { ChatRepository } from './repositories/chat.repository.js';
import { MessageRepository } from './repositories/message.repository.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'chat-service',
            brokers: [
              'kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092',
            ],
          },
          consumer: {
            groupId: 'chat-consumer-group',
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    UserModule,
  ],
  providers: [ChatGateway, ChatService, ChatRepository, MessageRepository],
  controllers: [ChatController],
})
export class ChatModule {}
