import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Chat, ChatSchema } from './schemas/chat.schema.js';
import { ChatController } from './controllers/chat.controller.js';
import { UserModule } from '../user/user.module.js';
import { MessageSchema } from './schemas/message.schema.js';
import { ChatRepository } from './repositories/chat.repository.js';
import { MessageRepository } from './repositories/message.repository.js';
import { GRPCUserService } from '../user/user.grpc.service.js';
import { ChatService } from './services/chat.service.js';
import { ChatGateway } from './gateways/chat.gateway.js';
import { Message } from './entities/message.entity.js';

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
  providers: [
    ChatGateway,
    { provide: 'ChatService', useClass: ChatService },
    { provide: 'ChatRepository', useClass: ChatRepository },
    { provide: 'MessageRepository', useClass: MessageRepository },
    { provide: 'UserService', useClass: GRPCUserService },
  ],
  controllers: [ChatController],
})
export class ChatModule {}
