import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!PORT) {
    throw new Error('PORT environment variable is not set');
  }

  await app.listen(PORT).then(() => {
    console.log(`Chat service is running on port ${PORT}`);
  });
}

void bootstrap();
