import { Kafka, Producer } from 'kafkajs';
import { env } from '@/config';

class KafkaClient {
  private static instance: KafkaClient;
  private kafka: Kafka;
  private readonly _producer: Producer;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'interaction-service',
      brokers: [env.KAFKA_BROKER_URL],
      sasl: {
        username: env.KAFKA_USERNAME,
        password: env.KAFKA_PASSWORD,
        mechanism: 'plain',
      },
      ssl: env.NODE_ENV === 'production',
    });

    this._producer = this.kafka.producer();
  }

  public static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  async connectProducer() {
    await this._producer.connect();
  }

  get producer() {
    return this._producer;
  }
}

export const kafkaClient = KafkaClient.getInstance();
