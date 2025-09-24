import { env } from '@/config';
import { initLoaders } from '@/loaders';
import { createApp } from '@/app';

const startServer = async () => {
  try {
    const app = createApp();
    await initLoaders();

    app.listen({ port: Number(env.PORT), host: '0.0.0.0' }, (err) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      console.log(`🚀 Subscription Service is running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
