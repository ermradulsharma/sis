'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { SearchInput } from '@/components/ui/SearchInput';
import { TicketForm } from '@/features/services/components/TicketForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, LifeBuoy } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/services/tickets?${params.toString()}`);
      
      if (response.success && response.data) {
        setTickets(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-rose-500';
      case 'high': return 'text-amber-500';
      case 'medium': return 'text-indigo-400';
      case 'low': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'ticket',
      label: 'Ticket',
      render: (_, row) => (
        <div className="flex items-start gap-3">
          <div className="mt-1 h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium text-slate-200">{row.subject}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {row.ticketNumber} • {row.customerId?.name || 'Unknown Customer'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: any) => (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (priority: any) => (
        <span className={`capitalize text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      ),
    },
    {
      key: 'agent',
      label: 'Agent',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.assignedTo ? (
            <>
              <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-medium">
                {row.assignedTo.firstName.charAt(0)}{row.assignedTo.lastName.charAt(0)}
              </div>
              <span className="text-sm text-slate-300">{row.assignedTo.firstName} {row.assignedTo.lastName}</span>
            </>
          ) : (
            <span className="text-sm text-slate-500 italic">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Created',
      render: (_, row) => (
        <span className="text-sm text-slate-400">
          {format(new Date(row.createdAt), 'MMM d, h:mm a')}
        </span>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Support Tickets"
        description="Manage customer inquiries and service requests."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            New Ticket
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
            placeholder="Search tickets..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        isLoading={isLoading}
        pagination={{
          page,
          totalPages,
          hasNextPage,
          hasPrevPage,
          onPageChange: handlePageChange,
        }}
      />

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create Ticket"
        description="Open a new service request for a customer."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('ticket-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Create Ticket
            </Button>
          </>
        }
      >
        <TicketForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchTickets();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
