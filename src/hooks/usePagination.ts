'use client';

import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationReturn {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setTotalItems: (total: number) => void;
  handlePageChange: (page: number) => void;
  setLimit: (limit: number) => void;
  offset: number;
}

/**
 * Hook for managing pagination state.
 */
export function usePagination(initialPage = 1, initialLimit = 10): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [totalItems, setTotalItemsState] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / limit)), [totalItems, limit]);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const offset = (page - 1) * limit;

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages],
  );

  const setTotalItems = useCallback((total: number) => {
    setTotalItemsState(total);
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setTotalItems,
    handlePageChange,
    setLimit,
    offset,
  };
}
