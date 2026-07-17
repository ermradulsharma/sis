import type { ApiResponse, FetchOptions, HttpMethod } from '@/types';
import { buildQueryString } from '@/lib/utils';

/**
 * Base API service for making HTTP requests to the backend.
 *
 * All module-specific services (user.service, role.service, etc.) build
 * on top of this shared service to avoid duplicating fetch logic.
 */

const BASE_URL = '/api';

/**
 * Core fetch wrapper with standard error handling, JSON serialization,
 * and query parameter support.
 */
async function request<T>(
    method: HttpMethod,
    endpoint: string,
    options: FetchOptions = {},
): Promise<ApiResponse<T>> {
    const { params, body, headers: customHeaders, ...rest } = options;

    const url = `${BASE_URL}${endpoint}${params ? buildQueryString(params) : ''}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    const config: RequestInit = {
        method,
        headers,
        ...rest,
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: {
                    code: data.error?.code || `HTTP_${response.status}`,
                    message: data.error?.message || response.statusText,
                    details: data.error?.details,
                },
            };
        }

        return data as ApiResponse<T>;
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'An unexpected error occurred',
            },
        };
    }
}

/** HTTP GET request. */
export function get<T>(endpoint: string, options?: FetchOptions): Promise<ApiResponse<T>> {
    return request<T>('GET', endpoint, options);
}

/** HTTP POST request. */
export function post<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions,
): Promise<ApiResponse<T>> {
    return request<T>('POST', endpoint, { ...options, body });
}

/** HTTP PUT request. */
export function put<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions,
): Promise<ApiResponse<T>> {
    return request<T>('PUT', endpoint, { ...options, body });
}

/** HTTP PATCH request. */
export function patch<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions,
): Promise<ApiResponse<T>> {
    return request<T>('PATCH', endpoint, { ...options, body });
}

/** HTTP DELETE request. */
export function del<T>(endpoint: string, options?: FetchOptions): Promise<ApiResponse<T>> {
    return request<T>('DELETE', endpoint, options);
}

export const apiService = { get, post, put, patch, del };
