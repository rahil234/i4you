import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Chat, ChatSchema } from './schemas/chat.schema.js';
import { UserModule } from '../user/user.module.js';
import { Message, MessageSchema } from './schemas/message.schema.js';
import { SignalingService } from './services/signaling.service.js';
import { VideoRepository } from './repositories/video.repository.js';
import { SignalingGateway } from './signaling.gateway.js';
import { SignalingController } from './signaling.controller.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'video-service',
            brokers: [
              'kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092',
            ],
          },
          consumer: {
            groupId: 'video-consumer-group',
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
  providers: [SignalingGateway, SignalingService, VideoRepository],
  exports: [SignalingService, VideoRepository],
  controllers: [SignalingController],
})
export class SignalingModule {}
