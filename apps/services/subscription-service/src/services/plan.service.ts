import { IPlanRepository } from '@/repositories/interfaces/IPlanRepository';
import { TYPES } from '@/types';
import { inject, injectable } from 'inversify';
import { IPlanService } from '@/services/interfaces/IPlanService';

injectable();
export class PlanService implements IPlanService {
  constructor(
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository,
  ) {}

  async getPlanDetails(planId: string) {
    const plan = await this._planRepository.findById(planId);
    if (!plan) throw new Error('Plan not found');
    return plan;
  }
}
