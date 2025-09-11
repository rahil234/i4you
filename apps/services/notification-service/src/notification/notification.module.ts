import { Module } from '@nestjs/common';
import { NotificationListener } from './listeners/notification.listener.js';
import { NotificationController } from './controllers/notification.controller.js';
import { NotificationsGateway } from './gateway/notifications.gateway.js';
import { NotificationsService } from './services/notifications.service.js';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [NotificationListener, NotificationController],
  providers: [
    NotificationsGateway,
    { provide: 'NotificationService', useClass: NotificationsService },
  ],
})
export class NotificationModule {}
