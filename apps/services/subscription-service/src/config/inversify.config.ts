import {Container} from 'inversify';
import {TYPES} from '@/types';
import {SubscriptionController} from '@/controllers/subscription.controller';
import {SubscriptionService} from '@/services/subscription.service';
import {ISubscriptionService} from '@/services/interfaces/ISubscriptionService';
import {ISubscriptionRepository} from "@/repositories/interfaces/ISubscriptionRepository";
import {MongoSubscriptionRepository} from "@/repositories/subscription.repository";
import {JsonPlanRepository} from "@/repositories/plan.repository";
import {IPlanRepository} from "@/repositories/interfaces/IPlanRepository";
import {IPlanService} from "@/services/interfaces/IPlanService";
import {PlanService} from "@/services/plan.service";
import {PlanController} from "@/controllers/plan.controller";

export const container = new Container();

container
    .bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);

container
    .bind<PlanController>(TYPES.PlanController).to(PlanController);

container
    .bind<IPlanRepository>(TYPES.PlanRepository).to(JsonPlanRepository);

container
    .bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService);

container
    .bind<IPlanService>(TYPES.PlanService).to(PlanService);

container
    .bind<ISubscriptionRepository>(TYPES.SubscriptionRepository).to(MongoSubscriptionRepository);
