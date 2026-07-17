'use client';

import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Pagination, type PaginationProps } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { TableColumn, SortOrder } from '@/types';
import { cn } from '@/lib/utils';

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  // Sort props
  sortField?: string;
  sortOrder?: SortOrder;
  onSort?: (field: string) => void;
  // Pagination props
  pagination?: PaginationProps;
  // Empty state props
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: { label: string; onClick: () => void };
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading,
  onRowClick,
  sortField,
  sortOrder,
  onSort,
  pagination,
  emptyStateTitle = 'No data found',
  emptyStateDescription = 'There are no records to display at this time.',
  emptyStateAction,
}: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        actionLabel={emptyStateAction?.label}
        onAction={emptyStateAction?.onClick}
      />
    );
  }

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-1 h-3 w-3 text-slate-500" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-indigo-400" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-indigo-400" />
    );
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                style={{ width: col.width }}
                className={cn(col.sortable && onSort ? 'cursor-pointer select-none hover:text-slate-200' : '')}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center">
                  {col.label}
                  {col.sortable && onSort && renderSortIcon(col.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <TableCell key={`skeleton-${i}-${col.key}`}>
                    <Skeleton className="h-5 w-full max-w-[80%]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Actual data
            data.map((row, index) => (
              <TableRow
                key={row._id || row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(onRowClick && 'cursor-pointer hover:bg-slate-800')}
              >
                {columns.map((col) => (
                  <TableCell key={`${row._id || row.id || index}-${col.key}`}>
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : (row[col.key as keyof T] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!isLoading && pagination && (
        <Pagination {...pagination} />
      )}
    </div>
  );
}
