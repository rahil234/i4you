export interface CheckoutSessionPayload {
  userId: string;
  priceId: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface SessionDetails {
  id: string;
  customer: unknown;
  subscription?: unknown;
  amount_total: number | null;
  status: string | null;
}

export interface IPaymentService {
  createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse>;

  getSessionDetails(sessionId: string): Promise<SessionDetails>;
}