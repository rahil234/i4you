import { handleError } from '@/utils/handleError';

export const handleApi = async <T>(fn: () => Promise<T>) => {
  try {
    const data = await fn();
    return { data: data, error: null };
  } catch (error) {
    return { data: null, error: handleError(error) };
  }
};
