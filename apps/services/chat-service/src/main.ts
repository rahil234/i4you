import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'chat-service',
        brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
      },
      consumer: {
        groupId: 'chat-consumer-group',
      },
    },
  });

  if (!PORT) {
    throw new Error('PORT environment variable is not set');
  }

  await app.listen(PORT).then(() => {
    console.log(`Chat service is running on port ${PORT}`);
  });
}

void bootstrap();
