import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisSocketService } from './services/redis.socket.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          username: 'default',
          password: process.env.REDIS_PASSWORD,
        });
      },
    },
    {
      provide: 'SocketService',
      useClass: RedisSocketService,
    },
  ],
  exports: ['SocketService', 'REDIS_CLIENT'],
})
export class SocketModule {}
