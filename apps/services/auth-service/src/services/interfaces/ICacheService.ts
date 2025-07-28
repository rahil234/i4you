export default interface ICacheService {
  get<T>(key: string): Promise<T | null>;

  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  del(key: string): Promise<void>;
};
