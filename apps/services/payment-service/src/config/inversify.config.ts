import {Container} from 'inversify';
import {TYPES} from '@/types';
import {PaymentController} from '@/controllers/payment.controller';
import {ISubscriptionService} from '@/services/interfaces/ISubscriptionService';
import {StripeWebhookController} from "@/controllers/stripe-webhook.controller";
import {IPaymentWebhookService} from "@/services/interfaces/IPaymentWebhookService";
import {StripePaymentWebhookService} from "@/services/stripe-webhook.service";
import {HttpSubscriptionService} from "@/services/http-subscription.service";
import {IPaymentService} from "@/services/interfaces/IPaymentService.ts";
import {StripePaymentService} from "@/services/stripe-payment.service";

const container = new Container();

container
    .bind<PaymentController>(TYPES.PaymentController).to(PaymentController);

container
    .bind<StripeWebhookController>(TYPES.StripeWebhookController).to(StripeWebhookController);

container
    .bind<IPaymentService>(TYPES.PaymentService).to(StripePaymentService);

container
    .bind<ISubscriptionService>(TYPES.SubscriptionService).to(HttpSubscriptionService);

container
    .bind<IPaymentWebhookService>(TYPES.PaymentWebhookService).to(StripePaymentWebhookService);

export {container};
