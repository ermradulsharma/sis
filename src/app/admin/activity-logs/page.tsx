'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { format } from 'date-fns';
import type { TableColumn } from '@/types';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    page,
    limit,
    totalPages,
    setTotalItems,
    handlePageChange,
    hasNextPage,
    hasPrevPage
  } = usePagination(1, 20);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiService.get<any[]>(`/activity-logs?${params.toString()}`);
      
      if (response.success && response.data) {
        setLogs(response.data);
        if (response.meta) setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, setTotalItems]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create': return <Badge variant="success">Create</Badge>;
      case 'update': return <Badge variant="info">Update</Badge>;
      case 'delete': return <Badge variant="error">Delete</Badge>;
      case 'login': return <Badge variant="default">Login</Badge>;
      default: return <Badge variant="default">{action}</Badge>;
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'timestamp',
      label: 'Date & Time',
      render: (_, row) => (
        <span className="text-slate-300">
          {format(new Date(row.createdAt), 'MMM d, yyyy HH:mm:ss')}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <span className="text-slate-300">
          {row.user ? `${row.user.firstName} ${row.user.lastName}` : 'System'}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (action) => getActionBadge(action as string),
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (resource) => (
        <span className="font-mono text-xs text-slate-400">{resource as string}</span>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      render: (details: any) => (
        <span className="text-xs text-slate-500 line-clamp-1 max-w-xs">
          {details ? JSON.stringify(details) : '-'}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (ip) => (
        <span className="font-mono text-xs text-slate-400">{ip as string || '-'}</span>
      ),
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Activity Logs"
        description="Audit trail of all actions performed within the ERP."
      />

      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        pagination={{
          page,
          totalPages,
          hasNextPage,
          hasPrevPage,
          onPageChange: handlePageChange,
        }}
      />
    </ContentArea>
  );
}
