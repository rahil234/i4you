import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { env } from '@/env.config';
import * as path from 'node:path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`, // your base URL
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwaggerDocs;
