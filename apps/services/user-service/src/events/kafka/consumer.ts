import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
});

export const consumer = kafka.consumer({ groupId: 'user-service-group' });

export const initKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'match.events', fromBeginning: false });
};
