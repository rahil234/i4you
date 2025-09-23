import {IPlanRepository} from "@/repositories/interfaces/IPlanRepository";
import {Plan} from "@/types";
import {injectable} from "inversify";
import * as fs from "fs";

@injectable()
export class JsonPlanRepository implements IPlanRepository {
    private plans = JSON.parse(
        fs.readFileSync(new URL('../data/plans.json', import.meta.url), 'utf-8')
    );

    async findAll(): Promise<Plan[]> {
        return this.plans;
    }

    async findById(id: string): Promise<Plan | null> {
        const plan = this.plans.find(p => p.id === id);
        return plan || null;
    }

    async create(plan: Plan): Promise<Plan> {
        this.plans.push(plan);
        return plan;
    }

    async update(id: string, planData: Partial<Plan>): Promise<Plan | null> {
        const index = this.plans.findIndex(p => p.id === id);
        if (index === -1) return null;

        this.plans[index] = {...this.plans[index], ...planData};
        return this.plans[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.plans.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.plans.splice(index, 1);
        return true;
    }
}
