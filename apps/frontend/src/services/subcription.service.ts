import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class SubscriptionService {
  subscribe = (planName: string) => handleApi(() =>
    api
      .post('/payment/create-stripe-session', { planName })
      .then(res => res.data),
  );

  getSessionDetails = (sessionId: string) => handleApi(() =>
    api
      .get(`/payment/session/${sessionId}`)
      .then(res => res.data),
  );
}

export default new SubscriptionService();
