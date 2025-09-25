import { inject, injectable } from 'inversify';
import Stripe from 'stripe';
import { stripe } from '@/config/stripe.config';
import { env } from '@/config';
import { TYPES } from '@/types';
import { IPaymentWebhookService } from '@/services/interfaces/IPaymentWebhookService';
import { handleAsync } from '@/utils/handle-async';

@injectable()
export class StripeWebhookController {
  constructor(
    @inject(TYPES.PaymentWebhookService)
    private _paymentWebhookService: IPaymentWebhookService,
  ) {}

  handleWebhookEvent = handleAsync(async (req, reply) => {
    const sig = req.headers['stripe-signature']!;
    const rawBody = req.body as Buffer;

    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );

    await this._paymentWebhookService.handleWebhookEvent(event);

    reply.status(200).send('Received');
  });
}
