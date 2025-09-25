import { Client } from '@elastic/elasticsearch';
import env from './config/env.config';

export const elasticClient = new Client({
  node: env.ES_URL,
  auth: {
    username: env.ES_USERNAME,
    password: env.ES_PASSWORD,
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
