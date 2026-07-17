'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { Plus, FileText, Download, MoreHorizontal } from 'lucide-react';
import type { TableColumn } from '@/types';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const {
    page,
    limit,
    totalPages,
    setTotalItems,
    handlePageChange,
    hasNextPage,
    hasPrevPage
  } = usePagination(1, 10);

  const fetchQuotations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/crm/quotations?${params.toString()}`);
      
      if (response.success && response.data) {
        setQuotations(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="default">Draft</Badge>;
      case 'sent': return <Badge variant="info">Sent</Badge>;
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'quotationNumber',
      label: 'Quotation #',
      render: (num) => (
        <span className="font-mono text-sm font-medium text-indigo-400">{num as string}</span>
      ),
    },
    {
      key: 'opportunity',
      label: 'Opportunity / Client',
      render: (_, row) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-slate-200">
            {row.opportunityId?.title || 'Unknown Opportunity'}
          </div>
          <div className="text-xs text-slate-500">
            {row.opportunityId?.customerId?.name || 'Unknown Client'}
          </div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (amount) => (
        <span className="font-semibold text-emerald-400">{formatCurrency(amount as number)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => getStatusBadge(status as string),
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      render: (date) => date ? (
        <span className={`text-sm ${new Date(date as string) < new Date() ? 'text-rose-400' : 'text-slate-400'}`}>
          {format(new Date(date as string), 'MMM d, yyyy')}
        </span>
      ) : <span className="text-slate-600">-</span>,
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" title="Download PDF">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Quotations"
        description="Manage price quotes and proposals for your opportunities."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create Quotation
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="w-full sm:max-w-md"
            placeholder="Search by quotation number..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={quotations}
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
