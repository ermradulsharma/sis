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
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import type { TableColumn } from '@/types';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
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

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/roles?${params.toString()}`);
      
      if (response.success && response.data) {
        setRoles(response.data);
        if (response.meta) setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Role Name',
      sortable: true,
      render: (name, row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200 capitalize">{name as string}</span>
            {row.isSystem && (
              <Badge variant="warning" className="px-1.5 py-0">System</Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (desc) => <span className="text-slate-400">{desc as string}</span>,
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (perms: any) => (
        <Badge variant="info">{perms?.length || 0} Permissions</Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_, row) => (
        <div className="flex justify-end">
          {row.isSystem ? (
            <div className="p-2" title="System roles cannot be modified">
              <ShieldAlert className="h-4 w-4 text-slate-500" />
            </div>
          ) : (
            <Dropdown
              items={[
                { label: 'Edit Role', icon: <Edit2 className="h-4 w-4" /> },
                { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true },
              ]}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Roles & Permissions"
        description="Define roles and manage granular access permissions."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create Role
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
            placeholder="Search roles..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={roles}
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
