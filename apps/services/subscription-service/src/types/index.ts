export const TYPES = {
    PlanRepository: Symbol.for('PlanRepository'),
    SubscriptionService: Symbol.for('SubscriptionService'),
    SubscriptionController: Symbol.for('SubscriptionController'),
    PlanController: Symbol.for('PlanController'),
    SubscriptionRepository: Symbol.for('SubscriptionRepository'),
    CacheService: Symbol.for('CacheService'),
    PlanService: Symbol.for('PlanService'),
};


export interface CreateSubscriptionPayload {
    userId: string;
    planId: string; // subscription plan
}

export interface CreateSubscriptionResponse {
    subscriptionId: string;
    status: 'active' | 'pending' | 'canceled' | 'expired';
    currentPeriodEnd?: Date;
}

export interface SubscriptionDetails {
    id: string;
    userId: string;
    planId: string;
    tier: 'free' | 'plus' | 'premium';
    planName: string;
    features: string[];
    status: 'active' | 'pending' | 'canceled' | 'expired';
    startDate: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd?: boolean;
}

export interface StripeData {
    price_id: string;
    product_id?: string;
}

export interface Plan {
    id: string;
    tier: 'free' | 'plus' | 'premium';
    name: string;
    planName: string;
    stripe: StripeData;
    price: string;
    features: string[];
    highlight: boolean;
    gradient: string;
    shadow: boolean;
}