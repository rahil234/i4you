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
        brokers: [process.env.KAFKA_BROKER_URL!],
        sasl: {
          username: process.env.KAFKA_USERNAME!,
          password: process.env.KAFKA_PASSWORD!,
          mechanism: 'plain',
        },
        ssl: process.env.NODE_ENV === 'production',
      },
      consumer: {
        groupId: 'notification-consumer-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
}

bootstrap()
  .then(() => {
    console.log(`Notification service is running on port ${PORT}`);
  })
  .catch(() => {
    console.error('Failed to start notification service');
  });
