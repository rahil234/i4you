import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // optional: for validation errors
}

export const handleError = (err: unknown): string => {
  // Check if it's an Axios error
  if ((err as AxiosError)?.isAxiosError) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    const status = axiosErr.response?.status;

    // Handle common status codes
    if (status === 400 || status === 422) {
      // Could be validation or user error
      const message = axiosErr.response?.data?.message;
      const validationErrors = axiosErr.response?.data?.errors;

      if (validationErrors) {
        const messages = Object.values(validationErrors).flat().join(', ');
        return message ? `${message}: ${messages}` : messages;
      }

      return message || 'Bad request';
    }

    if (status === 401) {
      return 'Unauthorized – please log in again';
    }

    if (status === 403) {
      return 'Forbidden – you do not have permission';
    }

    if (status === 404) {
      return 'Resource not found';
    }

    if (status === 500) {
      return 'Server error – try again later';
    }

    return axiosErr.response?.data?.message || 'An error occurred during the request';
  }

  // Handle non-Axios errors (e.g., thrown Error)
  if (err instanceof Error) {
    return err.message;
  }

  // Fallback for truly unknown cases
  return 'An unexpected error occurred';
};