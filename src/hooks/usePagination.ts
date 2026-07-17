'use client';

import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '@/config/constants';

interface UsePaginationOptions {
  /** Total number of items. */
  total: number;
  /** Items per page (default: PAGINATION.DEFAULT_LIMIT). */
  limit?: number;
  /** Initial page number (default: 1). */
  initialPage?: number;
}

interface UsePaginationReturn {
  /** Current page number (1-indexed). */
  page: number;
  /** Items per page. */
  limit: number;
  /** Total number of items. */
  total: number;
  /** Total number of pages. */
  totalPages: number;
  /** Whether there is a next page. */
  hasNextPage: boolean;
  /** Whether there is a previous page. */
  hasPrevPage: boolean;
  /** Go to a specific page. */
  goToPage: (page: number) => void;
  /** Go to the next page. */
  nextPage: () => void;
  /** Go to the previous page. */
  prevPage: () => void;
  /** Change the page size. */
  setLimit: (limit: number) => void;
  /** Calculate the offset for database queries. */
  offset: number;
}

/**
 * Hook for managing pagination state.
 * Works in tandem with the Pagination component and DataTable.
 */
export function usePagination({
  total,
  limit: initialLimit = PAGINATION.DEFAULT_LIMIT,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const offset = (page - 1) * limit;

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage((p) => p + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage((p) => p - 1);
  }, [hasPrevPage]);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    offset,
  };
}
