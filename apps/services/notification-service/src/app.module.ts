import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationListener } from './listeners/notification.listener';
import { RedisModule } from './redis/redis.module';
import { NotificationsService } from './services/notifications.service';
import { NotificationController } from './notification/notification.controller';

@Module({
  imports: [RedisModule],
  controllers: [NotificationListener, NotificationController],
  providers: [NotificationsGateway, NotificationsService],
})
export class AppModule {}
