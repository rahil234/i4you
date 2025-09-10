import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { kafkaClient } from '@/events/kafka/kafka';

export class KafkaService implements IKafkaService {
  private _producer = kafkaClient.producer;

  async connect() {
    await this._producer.connect();
  }

  async emit(topic: string, key: string, payload: object): Promise<void> {
    await this._producer.send({
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
