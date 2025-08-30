import { Express } from 'express';
import { swaggerSpec } from '@/config/swagger.config';
import interactionRoutes from '@/routes/interaction.routes';

export function registerRoutes(app: Express) {
  app.get('/api-docs-json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.get('/health', (_req, res) => {
    res.send('User Service is up and running');
  });

  app.use('/', interactionRoutes);
}
