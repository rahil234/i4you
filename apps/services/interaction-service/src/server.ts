import { env } from '@/config/index';
import { createApp } from './app';
import { initLoaders } from './loaders';

const startServer = async () => {
  try {
    const app = createApp();
    await initLoaders();

    app.listen(env.PORT, () => {
      console.log(`User Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
