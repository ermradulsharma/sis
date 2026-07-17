'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Edit2, Trash2, MapPin, Phone } from 'lucide-react';
import type { TableColumn, EntityStatus } from '@/types';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
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

  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/branches?${params.toString()}`);
      
      if (response.success && response.data) {
        setBranches(response.data);
        if (response.meta) setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Branch Name',
      sortable: true,
      render: (name, row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">{name as string}</span>
            {row.isHeadquarters && (
              <Badge variant="info" className="px-1.5 py-0">HQ</Badge>
            )}
          </div>
          <span className="text-xs text-slate-500 font-mono">Code: {row.code}</span>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Location',
      render: (address: any) => (
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="h-4 w-4" />
          <span>{address?.city}, {address?.country}</span>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          {row.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone className="h-3 w-3" />
              <span>{row.phone}</span>
            </div>
          )}
          <span className="text-xs text-slate-500">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        status === 'active' 
          ? <Badge variant="success">Active</Badge> 
          : <Badge variant="default">Inactive</Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_, row) => (
        <div className="flex justify-end">
          <Dropdown
            items={[
              { label: 'Edit', icon: <Edit2 className="h-4 w-4" /> },
              { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Branches"
        description="Manage company office locations and branches."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Branch
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="w-full sm:max-w-xs"
            placeholder="Search branches..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={branches}
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
