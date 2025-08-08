import { Client } from '@elastic/elasticsearch';
import { env } from '@/config';

const elastic = new Client({
  node: env.ES_URL,
  maxRetries: 5,
  requestTimeout: 60000,
  auth: {
    apiKey: env.ES_API_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default elastic;
