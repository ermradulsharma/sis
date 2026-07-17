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
import { Plus, Building, Globe, MapPin, MoreHorizontal, Download } from 'lucide-react';
import type { TableColumn } from '@/types';
import { exportToCSV } from '@/lib/csv';
import { SlideOver } from '@/components/ui/SlideOver';
import { CustomerForm } from '@/features/crm/components/CustomerForm';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
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

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/crm/customers?${params.toString()}`);
      
      if (response.success && response.data) {
        setCustomers(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Customer',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-slate-200">{row.name}</div>
            {row.industry && (
              <div className="text-xs text-slate-500 mt-0.5">{row.industry}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Details',
      render: (_, row) => (
        <div className="space-y-1">
          {row.website && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Globe className="h-3.5 w-3.5" /> 
              <a href={row.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 hover:underline">
                {row.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {row.address?.city && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> 
              {row.address.city}{row.address.country ? `, ${row.address.country}` : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'accountManager',
      label: 'Account Manager',
      render: (manager: any) => manager ? (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
            {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
          </div>
          <span className="text-sm text-slate-300">{manager.firstName} {manager.lastName}</span>
        </div>
      ) : (
        <span className="text-sm text-slate-500 italic">Unassigned</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Customer Since',
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
          <Button variant="ghost" size="sm" onClick={() => window.location.href = `/crm/customers/${row._id}`}>
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
        title="Customers"
        description="Manage your active customer base and accounts."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => exportToCSV(customers, 'customers_export')}>
              Export
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
              Add Customer
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="w-full sm:max-w-md"
            placeholder="Search customers by name..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customers}
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
        title="Add New Customer"
        description="Create a new customer profile."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('customer-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Save Customer
            </Button>
          </>
        }
      >
        <CustomerForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchCustomers();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
