import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const PORT = process.env.PORT!;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-service',
        brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
      },
      consumer: {
        groupId: 'notification-consumer-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
}

bootstrap();
