import { Kafka, Producer, Consumer } from 'kafkajs';
import { env } from '@/config';

class KafkaClient {
  private static instance: KafkaClient;
  private kafka: Kafka;
  private readonly _producer: Producer;
  private readonly _consumer: Consumer;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'match-service',
      brokers: [env.KAFKA_BROKER_URL],
      sasl: {
        username: env.KAFKA_USERNAME,
        password: env.KAFKA_PASSWORD,
        mechanism: 'plain',
      },
      ssl: env.NODE_ENV === 'production',
    });

    this._producer = this.kafka.producer();
    this._consumer = this.kafka.consumer({
      groupId: 'match-service-group',
    });
  }

  public static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  async connectProducer() {
    await this._producer.connect();
    console.log('Kafka Producer connected');
  }

  async connectConsumer(topics: { topic: string; fromBeginning?: boolean }[]) {
    await this._consumer.connect();
    for (const t of topics) {
      await this._consumer.subscribe(t);
    }
    console.log('Kafka Consumer connected & subscribed');
  }

  async runConsumer(eachMessageHandler: (payload: any) => Promise<void>) {
    await this._consumer.run({
      eachMessage: async ({ message }) => {
        await eachMessageHandler({
          key: message.key?.toString(),
          value: message.value?.toString(),
        });
      },
    });
  }

  get producer() {
    return this._producer;
  }
}

export const kafkaClient = KafkaClient.getInstance();
