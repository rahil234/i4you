import type { PushSubscription } from 'web-push';
import { Body, Controller, Post, Headers, Inject } from '@nestjs/common';
import { INotificationsService } from '../services/interfaces/INotificationService';

@Controller()
export class NotificationController {
  constructor(
    @Inject('NotificationService')
    private readonly notificationService: INotificationsService,
  ) {}

  @Post('subscribe')
  async subscribe(
    @Body() subscription: PushSubscription,
    @Headers('x-user-id') userId: string,
  ) {
    await this.notificationService.subscribe(userId, subscription);
  }

  @Post('unsubscribe')
  unsubscribe(@Body() subscription: PushSubscription) {
    console.log('Unsubscribed:', subscription);
  }

  @Post('send')
  async sendTest(@Body() body: { message: string }) {
    const { message } = body;
    const payload = JSON.stringify({
      title: 'Notification from NestJS',
      body: message,
    });

    const subscriptions = await this.notificationService.getAllSubscription();

    console.log('subscriptions:', subscriptions);

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await this.notificationService.sendNotification(sub, payload);
          console.log('Notification sent');
          return { success: true };
        } catch (err) {
          console.error('Error sending notification:', err);
          return { success: false, error: 'Failed to send notification' };
        }
      }),
    );

    return { success: true, message: 'Notifications sent' };
  }
}
