import mongoose, {Schema, Document, ObjectId} from 'mongoose';

export interface SubscriptionDocument extends Document<ObjectId> {
    userId: string;
    planId: string;
    tier: 'free' | 'plus' | 'premium';
    status: 'pending' | 'active' | 'canceled' | 'expired';
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<SubscriptionDocument>(
    {
        userId: {type: String, required: true},
        planId: {type: String, required: true},
        tier: {
            type: String,
            enum: ['free', 'plus', 'premium'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'canceled', 'expired'],
            default: 'pending',
        },
        currentPeriodEnd: {type: Date},
        cancelAtPeriodEnd: {type: Boolean, default: false},
    },
    {timestamps: true}
);

export const SubscriptionModel = mongoose.model<SubscriptionDocument>(
    'Subscription',
    subscriptionSchema
);
