'use client';

import {useSearchParams, useRouter} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import subscriptionService from '@/services/subcription.service';
import {Loader} from 'lucide-react';

const Page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Stripe params
    const sessionId = searchParams.get('session_id');

    // Razorpay params
    const razorpayPaymentId = searchParams.get('razorpay_payment_id');
    const razorpayLinkStatus = searchParams.get('razorpay_payment_link_status');

    const {data, error, isLoading} = useQuery({
        queryKey: ['payment-session', sessionId, razorpayPaymentId],
        queryFn: async () => {
            if (sessionId) {
                // Stripe flow
                const {data, error} = await subscriptionService.getSessionDetails(sessionId);
                if (error) throw new Error('Failed to fetch Stripe session details');
                return {
                    provider: 'stripe',
                    customer: data.customer,
                    status: data.status,
                    amount: (data.amount_total / 100).toFixed(2),
                };
            } else if (razorpayPaymentId) {
                // Razorpay flow
                const payload = {
                    paymentId: razorpayPaymentId,
                    linkStatus: razorpayLinkStatus,
                    // you can pass signature, link_id etc. if your backend verifies
                };
                const {data, error} = await subscriptionService.getSessionDetails(payload.paymentId);
                if (error) throw new Error('Failed to verify Razorpay payment');
                return {
                    provider: 'razorpay',
                    customer: data.customer,
                    status: data.status,
                    amount: (data.amount / 100).toFixed(2),
                };
            } else {
                throw new Error('No payment info found in URL');
            }
        },
        enabled: !!sessionId || !!razorpayPaymentId,
    });

    const handleBackToProfile = () => {
        router.push('/profile');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full text-center">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <Loader className="animate-spin mb-2"/>
                        <p className="text-gray-500">Verifying your payment...</p>
                    </div>
                ) : error ? (
                    <div className="text-red-500">
                        <p>❌ {error.message}</p>
                    </div>
                ) : data ? (
                    <>
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">✅ Payment Successful!</h2>
                        <p className="text-gray-700 mb-4">
                            Thank you for your subscription via {data.provider}.
                        </p>
                        <div className="text-left text-black text-sm bg-gray-100 rounded-md p-4 mb-4">
                            <p><strong>Customer:</strong> {data.customer?.email ?? 'N/A'}</p>
                            <p><strong>Status:</strong> {data.status}</p>
                            <p><strong>Amount:</strong> ₹{data.amount}</p>
                        </div>
                        <button
                            onClick={handleBackToProfile}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Profile
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-red-500">No payment data available.</p>
                        <button
                            onClick={handleBackToProfile}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Profile
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Page;
