import { Client } from '@elastic/elasticsearch';
import { env } from '@/config';

const elastic = new Client({
  node: env.ES_URL,
  maxRetries: 5,
  requestTimeout: 60000,
  auth: {
    username: env.ES_USERNAME,
    password: env.ES_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default elastic;
