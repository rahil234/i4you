import {ISubscriptionService} from "@/services/interfaces/ISubscriptionService";
import {injectable} from "inversify";
import {PlanDetails} from "@/types";

@injectable()
export class HttpSubscriptionService implements ISubscriptionService {
    async createSubscription(userId: string, planId: string): Promise<void> {
        await fetch('http://subscription-service:4010/subscriptions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({planId, userId})
        })
    }

    async getPlanDetails(planId: string): Promise<PlanDetails> {
        const res = await fetch(`http://subscription-service:4010/plan/${planId}`, {
            method: 'GET',
        })

        if (!res.ok) {
            throw new Error('Failed to fetch plan details');
        }


        return await res.json() as PlanDetails;
    }
}
