import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: 'es-worker',
  brokers: [process.env.KAFKA_BROKER!],
});

export const consumer = kafka.consumer({ groupId: 'es-worker-group' });