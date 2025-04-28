import axios from 'axios';
import { JsonObject } from 'swagger-ui-express';
import { env } from '@/config/index';

let combinedSpec: JsonObject = {};

export const loadSpecs = async (): Promise<JsonObject> => {
  if (Object.keys(combinedSpec).length > 0) return combinedSpec;

  const [auth, user] = await Promise.all([
    axios.get(`${env.AUTH_SERVER_URL}/api-docs-json`),
    axios.get(`${env.USER_SERVER_URL}/api-docs-json`),
  ]);

  combinedSpec = {
    openapi: '3.0.0',
    info: {
      title: 'I4You API',
      version: '1.0.0',
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      ...auth.data.paths,
      ...user.data.paths,
    },
    components: {
      ...auth.data.components,
      ...user.data.components,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

  return combinedSpec;
};