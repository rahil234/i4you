import {
  Model,
  Document,
  RootFilterQuery,
  ObjectId,
  UpdateQuery,
} from 'mongoose';
import IBaseRepository from './interfaces/IBaseRepositoryInterface';
import { UserDocument } from '@/models/user.model';

export class MongoBaseRepository<
  T extends { id: string },
  D extends Document<ObjectId>,
> implements IBaseRepository<T>
{
  constructor(
    protected readonly model: Model<D>,
    protected readonly toDomain: (doc: D) => T
  ) {}

  async create(data: Partial<T>) {
    const created = await this.model.create(data);
    return this.toDomain(created);
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<T[]> {
    const docs = await this.model.find().exec();
    return docs.map(this.toDomain);
  }

  async find(filter: Partial<T>): Promise<T[]> {
    const docs = await this.model
      .find(filter as RootFilterQuery<UserDocument>)
      .exec();
    return docs.map(this.toDomain);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, data as UpdateQuery<UserDocument>, { new: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string) {
    return Boolean(await this.model.findByIdAndDelete(id).exec());
  }
}
