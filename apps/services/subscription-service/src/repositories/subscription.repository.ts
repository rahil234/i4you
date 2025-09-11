import {ISubscriptionRepository} from './interfaces/ISubscriptionRepository';
import {Subscription} from '@/entities/subscription.entity';
import {SubscriptionDocument, SubscriptionModel} from '@/models/subscription.model';

export class MongoSubscriptionRepository implements ISubscriptionRepository {
    private _toEntity(doc: SubscriptionDocument | null): Subscription | null {
        if (!doc) return null;
        return new Subscription(
            doc._id.toString(),
            doc.userId.toString(),
            doc.planId,
            doc.tier,
            doc.status,
            doc.createdAt,
            doc.currentPeriodEnd,
            doc.cancelAtPeriodEnd,
        );
    }

    async findById(id: string): Promise<Subscription | null> {
        const doc = await SubscriptionModel.findById(id).exec();
        return this._toEntity(doc);
    }

    async findByUserId(userId: string): Promise<Subscription[] | null> {
        const docs = await SubscriptionModel.find({userId}).exec();
        return docs.length ? docs.map(d => this._toEntity(d)!) : null;
    }

    async findActiveByUserId(userId: string): Promise<Subscription | null> {
        const doc = await SubscriptionModel.findOne({
            userId,
            status: 'active',
        }).exec();
        return this._toEntity(doc);
    }

    async create(data: Subscription): Promise<Subscription> {
        const doc = await SubscriptionModel.create(data);
        return this._toEntity(doc)!;
    }

    async update(id: string, data: Partial<Subscription>): Promise<Subscription | null> {
        const doc = await SubscriptionModel.findByIdAndUpdate(id, data, {new: true}).exec();
        return this._toEntity(doc);
    }

    async activateSubscription(id: string): Promise<Subscription | null> {
        const doc = await SubscriptionModel.findByIdAndUpdate(
            id,
            {status: 'active', startedAt: new Date()},
            {new: true}
        ).exec();
        return this._toEntity(doc);
    }

    async cancelSubscription(id: string, cancelAtPeriodEnd = false): Promise<Subscription | null> {
        const update: any = {cancelAtPeriodEnd};
        if (!cancelAtPeriodEnd) update.status = 'canceled';

        const doc = await SubscriptionModel.findByIdAndUpdate(id, update, {new: true}).exec();
        return this._toEntity(doc);
    }

    async expireSubscription(id: string): Promise<Subscription | null> {
        const doc = await SubscriptionModel.findByIdAndUpdate(
            id,
            {status: 'expired'},
            {new: true}
        ).exec();
        return this._toEntity(doc);
    }

    async listByUser(userId: string): Promise<Subscription[]> {
        const docs = await SubscriptionModel.find({userId}).exec();
        return docs.map((d) => this._toEntity(d)!);
    }
}