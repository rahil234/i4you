import {Kafka} from 'kafkajs';
import dotenv from 'dotenv';
import env from "@/config/env.config";

dotenv.config();

const kafka = new Kafka({
    clientId: 'es-worker',
    brokers: [env.KAFKA_BROKER_URL],
    sasl: env.NODE_ENV === 'development' ? {
        mechanism: 'scram-sha-512',
        username: env.KAFKA_USERNAME,
        password: env.KAFKA_PASSWORD,
    } : {
        mechanism: 'plain',
        username: env.KAFKA_USERNAME,
        password: env.KAFKA_PASSWORD,
    },
    ssl: process.env.NODE_ENV === 'production',
});

export const consumer = kafka.consumer({groupId: 'es-worker-group'});