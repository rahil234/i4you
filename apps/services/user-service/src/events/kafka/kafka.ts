import { Kafka, Producer, Consumer } from 'kafkajs';

class KafkaClient {
  private static instance: KafkaClient;
  private kafka: Kafka;
  private readonly _producer: Producer;
  private readonly _consumer: Consumer;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'user-service',
      brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
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
