import api from '@/lib/api';
import {handleApi} from '@/utils/apiHandler';
import {Plan} from "@/types";

class SubscriptionService {
    subscribe = (planId: Plan['planId'], provider = 'stripe') => handleApi(() =>
        api
            .post(`/payment/${provider}/session`, {planId})
            .then(res => res.data),
    );

    getSessionDetails = (sessionId: string) => handleApi(() =>
        api
            .get(`/payment/session/${sessionId}`)
            .then(res => res.data),
    );
}

export default new SubscriptionService();
