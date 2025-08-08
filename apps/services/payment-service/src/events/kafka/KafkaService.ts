import { Kafka, logLevel, Producer } from 'kafkajs';
import IKafkaService from './interfaces/IKafkaService';

export class KafkaService implements IKafkaService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'match-service',
      brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
      logLevel: logLevel.WARN,
    });

    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
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
