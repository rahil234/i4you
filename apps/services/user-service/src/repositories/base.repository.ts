import { Model, Document, RootFilterQuery } from 'mongoose';
import IBaseRepository from './interfaces/IBaseRepositoryInterface';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>) {
    const entity = new this.model(data);
    return entity.save();
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async find(query: RootFilterQuery<T>) {
    return this.model.find(query).exec();
  }

  async update(id: string, data: Partial<T>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return Boolean(await this.model.findByIdAndDelete(id).exec());
  }
}
