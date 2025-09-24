export const TYPES = {
  PaymentController: Symbol.for('PaymentController'),
  StripeWebhookController: Symbol.for('StripeWebhookController'),
  CacheService: Symbol.for('CacheService'),
  PaymentService: Symbol.for('PaymentService'),
  PaymentWebhookService: Symbol.for('PaymentWebhookService'),
  SubscriptionService: Symbol.for('SubscriptionService'),
};

export interface CheckoutSessionPayload {
  userId: string;
  priceId: string;
  planId: string;
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

export interface PlanDetails {
  id: string;
  tier: 'free' | 'plus' | 'premium';
  name: string;
  stripe: {
    price_id: string;
    product_id?: string;
  };
  planName: string;
  price: string;
  features: string[];
  highlight: boolean;
  gradient: string;
  shadow: boolean;
}
