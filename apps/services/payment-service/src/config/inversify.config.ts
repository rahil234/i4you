import { Container } from 'inversify';
import { TYPES } from '@/types';
import { StripeController } from '@/controllers/stripe.controller';
import { StripePaymentService } from '@/services/stripe-payment.service';
import { IPaymentService } from '@/services/interfaces/IPaymentService';
// import { RazorpayPaymentService } from '@/services/razorpay-payment.service';

const container = new Container();

container
  .bind<StripeController>(TYPES.StripeController).to(StripeController);

container
  .bind<IPaymentService>(TYPES.PaymentService).to(StripePaymentService);

export { container };
