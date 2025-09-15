import {inject, injectable} from 'inversify';
import {TYPES} from '@/types';
import {IPlanService} from "@/services/interfaces/IPlanService";

@injectable()
export class PlanController {
    constructor(@inject(TYPES.PlanService) private _planService: IPlanService) {
    }

    async getPlanDetails(planId: string) {
        return this._planService.getPlanDetails(planId);
    }
}
