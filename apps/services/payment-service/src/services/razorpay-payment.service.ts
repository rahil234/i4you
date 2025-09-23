import Razorpay from 'razorpay';
import {env} from '@/config';
import {IPaymentService} from "@/services/interfaces/IPaymentService.ts";
import {CheckoutSessionPayload, CheckoutSessionResponse, SessionDetails} from "@/types";

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
            amount: 50000,
            currency: 'INR',
            description: 'Payment for order',
            reference_id: `order_ref_${Date.now()}`,
            notes: {
                userId: payload.userId,
            },
            customer: {
                name: 'Customer Name',
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

        const order = await this.razorpay.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1"
        });

        console.log('Razorpay payment link created:', paymentLink);
        console.log('Razorpay order created:', order);

        return {url: paymentLink.short_url}; // hosted Razorpay page
    }

    async getSessionDetails(sessionId: string): Promise<SessionDetails> {
        try {

            console.log('Fetching Razorpay payment link details for ID:', sessionId);
            const order = await this.razorpay.orders.fetch(sessionId);

            console.log('razarpay order', order);

            return {
                id: order.id,
                customer: null,
                subscription: null,
                amount_total: Number(order.amount),
                status: order.status,
            };
        } catch (error) {
            console.error('Error fetching Razorpay payment link details:', error);
            throw error;
        }
    }
}