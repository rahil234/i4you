import { inject, injectable } from 'inversify';
import { handleAsync } from '@/utils/handle-async';
import { IPaymentService } from '@/services/interfaces/IPaymentService';
import { TYPES } from '@/types';

@injectable()
export class StripeController {
  constructor(@inject(TYPES.PaymentService) private paymentService: IPaymentService) {
  }

  createCheckoutSession = handleAsync(async (req, reply) => {
    const { userId, priceId } = { userId: 'user123', priceId: 'price_1RtKwUC2pYUroNBIdOBXL1rB' };

    const session = await this.paymentService.createCheckoutSession({ userId, priceId });
    return reply.send(session);
  });

  getSessionDetails = handleAsync(async (req, reply) => {
    const sessionId = (req.params as { sessionId: string }).sessionId;
    const session = await this.paymentService.getSessionDetails(sessionId);
    return reply.send(session);
  });
}
