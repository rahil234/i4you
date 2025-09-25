import { IPlanRepository } from '@/repositories/interfaces/IPlanRepository';
import { Plan } from '@/types';
import { injectable } from 'inversify';
import * as fs from 'fs';

@injectable()
export class JsonPlanRepository implements IPlanRepository {
  private _plans = JSON.parse(
    fs.readFileSync(new URL('../data/plans.json', import.meta.url), 'utf-8'),
  );

  async findAll(): Promise<Plan[]> {
    return await this._plans;
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await this._plans.find((p) => p.id === id);
    return plan || null;
  }

  async create(plan: Plan): Promise<Plan> {
    await this._plans.push(plan);
    return plan;
  }

  async update(id: string, planData: Partial<Plan>): Promise<Plan | null> {
    const index = await this._plans.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this._plans[index] = { ...this._plans[index], ...planData };
    return this._plans[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = await this._plans.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this._plans.splice(index, 1);
    return true;
  }
}
