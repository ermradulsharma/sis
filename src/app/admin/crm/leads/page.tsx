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
import { Plus, Building2, UserPlus, Phone, Mail, MoreHorizontal } from 'lucide-react';
import type { TableColumn } from '@/types';
import { SlideOver } from '@/components/ui/SlideOver';
import { LeadForm } from '@/features/crm/components/LeadForm';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
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

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/crm/leads?${params.toString()}`);
      
      if (response.success && response.data) {
        setLeads(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="info">New</Badge>;
      case 'contacted': return <Badge variant="warning">Contacted</Badge>;
      case 'qualified': return <Badge variant="success">Qualified</Badge>;
      case 'converted': return <Badge variant="success">Converted</Badge>;
      case 'lost': return <Badge variant="error">Lost</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300">
            {row.firstName.charAt(0)}{row.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-slate-200">{row.firstName} {row.lastName}</div>
            {row.companyName && (
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <Building2 className="h-3 w-3" /> {row.companyName}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Mail className="h-3.5 w-3.5" /> {row.email}
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Phone className="h-3.5 w-3.5" /> {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => getStatusBadge(status as string),
    },
    {
      key: 'source',
      label: 'Source',
      render: (source) => (
        <span className="text-sm text-slate-400 capitalize">{source as string || 'Unknown'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (date) => (
        <span className="text-sm text-slate-400">
          {format(new Date(date as string), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = `/crm/leads/${row._id}`}>
            View Profile
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<MoreHorizontal className="h-4 w-4" />}>
          </Button>
        </div>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Leads"
        description="Manage potential prospects and track initial contact."
        actions={
          <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            Add Lead
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
            placeholder="Search leads by name, email, or company..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={leads}
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
        title="Add New Lead"
        description="Create a new lead to start tracking their progress."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('lead-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Save Lead
            </Button>
          </>
        }
      >
        <LeadForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchLeads();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
