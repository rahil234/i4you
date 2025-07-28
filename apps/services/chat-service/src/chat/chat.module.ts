import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';

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
