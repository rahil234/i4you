export interface ICacheService {
  get<T>(key: string): Promise<boolean | null>;

  set<T>(key: string, value: boolean, ttlSeconds?: number): Promise<void>;

  del(key: string): Promise<void>;
}
