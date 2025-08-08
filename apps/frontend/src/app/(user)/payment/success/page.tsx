'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import subscriptionService from '@/services/subcription.service';
import { Loader } from 'lucide-react';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const { data, error, isLoading } = useQuery({
    queryKey: ['stripe-session', sessionId],
    queryFn: async () => {
      const { data, error } = await subscriptionService.getSessionDetails(sessionId!);
      if (error) {
        throw new Error('Failed to fetch session details');
      }
      return data;
    },
    enabled: !!sessionId,
  });

  const handleBackToProfile = () => {
    router.push('/profile'); // adjust the route if needed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full text-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader className="animate-spin mb-2" />
            <p className="text-gray-500">Verifying your payment...</p>
          </div>
        ) : error ? (
          <div className="text-red-500">
            <p>❌ Failed to fetch payment details.</p>
          </div>
        ) : data ? (
          <>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">✅ Payment Successful!</h2>
            <p className="text-gray-700 mb-4">Thank you for your subscription.</p>
            <div className="text-left text-black text-sm bg-gray-100 rounded-md p-4 mb-4">
              <p><strong>Customer:</strong> {data.customer?.email ?? 'N/A'}</p>
              <p><strong>Status:</strong> {data.status}</p>
              <p><strong>Amount:</strong> ₹{(data.amount_total / 100).toFixed(2)}</p>
            </div>
            <button
              onClick={handleBackToProfile}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Profile
            </button>
          </>
        ) : (
          <p>No session data available.</p>
        )}
      </div>
    </div>
  );
};

export default Page;