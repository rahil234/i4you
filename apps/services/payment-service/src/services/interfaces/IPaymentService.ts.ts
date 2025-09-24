import {
  CheckoutSessionPayload,
  CheckoutSessionResponse,
  SessionDetails,
} from '@/types';

export interface IPaymentService {
  createCheckoutSession(
    payload: CheckoutSessionPayload,
  ): Promise<CheckoutSessionResponse>;

  getSessionDetails(sessionId: string): Promise<SessionDetails>;
}
