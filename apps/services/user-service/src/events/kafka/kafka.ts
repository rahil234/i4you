import { Kafka, Producer, Consumer } from 'kafkajs';
import { env } from '@/config';

class KafkaClient {
  private static instance: KafkaClient;
  private kafka: Kafka;
  private readonly _producer: Producer;
  private readonly _consumer: Consumer;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'user-service',
      brokers: [env.KAFKA_BROKER_URL],
      sasl: {
        username: env.KAFKA_USERNAME,
        password: env.KAFKA_PASSWORD,
        mechanism: 'plain',
      },
      ssl: env.NODE_ENV === 'production',
    });

    this._producer = this.kafka.producer();
    this._consumer = this.kafka.consumer({ groupId: 'user-service-group' });
  }

  public static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  get producer() {
    return this._producer;
  }

  get consumer() {
    return this._consumer;
  }
}

export const kafkaClient = KafkaClient.getInstance();
