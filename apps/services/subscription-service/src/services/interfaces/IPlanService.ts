import { Plan } from '@/types';

export interface IPlanService {
  getPlanDetails(subscriptionId: string): Promise<Plan | null>;
}
