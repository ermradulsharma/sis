import type { PaginationMeta } from './common.types';

/**
 * Standard successful API response.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

/**
 * Standard error API response.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Union type for all API responses.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Generic list response with pagination.
 */
export interface ApiListResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

/**
 * HTTP methods used in the API service.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Fetch options extending the native RequestInit.
 */
export interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
}
