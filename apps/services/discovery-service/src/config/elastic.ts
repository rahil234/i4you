import { Client } from '@elastic/elasticsearch';
import { env } from '@/config';

const elastic = new Client({
  node: env.ES_URL,
  maxRetries: Number(env.ES_MAX_RETRY),
  requestTimeout: Number(env.ES_REQUEST_TIMEOUT),
  auth: {
    username: env.ES_USERNAME,
    password: env.ES_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default elastic;
