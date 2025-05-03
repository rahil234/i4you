import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';
import type { OnboardingData } from '@/types';

class onBoardingService {
  submitUserOnBoarding = (data: OnboardingData) =>
    handleApi(() =>
      api
        .post('/user/onboarding', { data })
        .then(res => res.data),
    );
}

export default new onBoardingService();
