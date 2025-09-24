import { Plan } from '@/types';

export interface IPlanRepository {
  findAll(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | null>;
  create(plan: Plan): Promise<Plan>;
  update(id: string, plan: Partial<Plan>): Promise<Plan | null>;
  delete(id: string): Promise<boolean>;
}
