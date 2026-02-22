import app from '@/app';
import { env } from '@/config/index';
import { connectDB } from '@/config/db.config';
import { connectRedis } from '@/config/redis.config';

const startServer = async () => {
  await connectDB();
  await connectRedis();
  app.listen(env.PORT);
};

startServer()
  .then(() => {
    console.log('Auth Server running on port ', env.PORT);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
