import { Document, RootFilterQuery } from 'mongoose';

interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;

  findById(id: string): Promise<T | null>;

  findAll(): Promise<T[]>;

  find(query: RootFilterQuery<T>): Promise<T[]>;

  update(id: string, data: Partial<T>): Promise<T | null>;

  delete(id: string): Promise<boolean>;
}

export default IBaseRepository;
