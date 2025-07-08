import { Kafka, Producer } from 'kafkajs';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';

export class KafkaService implements IKafkaService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'user-service',
      brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
    });

    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async emit(topic: string, key: string, payload: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(payload),
        },
      ],
    });
  }
}