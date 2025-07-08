import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'match-service',
  brokers: ['kafka-cluster-kafka-brokers.kafka.svc.cluster.local:9092'],
});

export const consumer = kafka.consumer({ groupId: 'match-service-group' });

export const initKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user.events', fromBeginning: false });
};
