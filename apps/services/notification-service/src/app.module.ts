import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationListener } from './listeners/notification.listener';
import { RedisModule } from './redis/redis.module';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [RedisModule],
  controllers: [NotificationListener],
  providers: [NotificationsGateway, NotificationsService],
})
export class AppModule {}
