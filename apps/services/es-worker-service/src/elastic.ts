import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

export const elasticClient = new Client({
  node: process.env.ES_URL!,
  auth: {
    apiKey: process.env.ES_API_KEY!,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function indexUser(user: any) {
  await elasticClient.index({
    index: 'users',
    id: user.id,
    document: user,
  });
  console.log(`User indexed: ${user.id}`);
}
