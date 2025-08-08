import { Container } from 'inversify';
import { TYPES } from '@/types';
import { StripeController } from '@/controllers/stripe.controller';

const container = new Container();

container
  .bind<StripeController>(TYPES.StripeController).to(StripeController);

export { container };
