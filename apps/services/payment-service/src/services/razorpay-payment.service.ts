import {
  CheckoutSessionPayload,
  CheckoutSessionResponse,
  IPaymentService, SessionDetails,
} from '@/services/interfaces/IPaymentService';
import Razorpay from 'razorpay';
import { env } from '@/config';

export class RazorpayPaymentService implements IPaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> {
    const paymentLink = await this.razorpay.paymentLink.create({
      amount: 50000, // fetch from DB using payload.priceId ideally
      currency: 'INR',
      description: 'Payment for order',
      customer: {
        name: 'Customer Name', // you can pass payload.userId -> fetch details
        email: 'customer@example.com',
        contact: '9876543210',
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `https://i4you.local.net/payment/success`,
      callback_method: 'get',
    });

    return { url: paymentLink.short_url }; // hosted Razorpay page
  }

  async getSessionDetails(sessionId: string): Promise<SessionDetails> {
    const order = await this.razorpay.orders.fetch(sessionId);
    return {
      id: order.id,
      customer: null,
      subscription: null,
      amount_total: Number(order.amount),
      status: order.status,
    };
  }
}