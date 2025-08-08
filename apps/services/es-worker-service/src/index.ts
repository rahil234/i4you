import { consumer } from './kafka';
import { indexUser } from './elastic';

async function runWorker() {
  await consumer.connect().then(() => {
    console.log('Connected to Kafka consumer');
  });

  await consumer.subscribe({ topic: 'user.events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value || !message.key) return;

      const [key, data] = [message.key.toString(), JSON.parse(message.value.toString())];

      console.log(`Received event: ${key}`, data);

      if (key === 'user.created' || key === 'user.profile.updated') {
        console.log(`Indexing user: ${data._id}`);
        await indexUser(data);
      }
    },
  });
}

runWorker().catch(console.error);
