'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import type { TableColumn, UserStatus } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const {
    page,
    limit,
    totalPages,
    setTotalItems,
    handlePageChange,
    hasNextPage,
    hasPrevPage
  } = usePagination(1, 10);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);

      const response = await apiService.get<any[]>(`/users?${params.toString()}`);
      
      if (response.success && response.data) {
        setUsers(response.data);
        if (response.meta) setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, setTotalItems]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter]);

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'inactive': return <Badge variant="default">Inactive</Badge>;
      case 'suspended': return <Badge variant="error">Suspended</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} fallback={row.name} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-slate-200">{row.name}</span>
            <span className="text-xs text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-slate-500" />
          <span className="text-slate-300">{row.role?.name || 'No Role'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => getStatusBadge(status as UserStatus),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (date) => date ? new Date(date as string).toLocaleDateString() : 'Never',
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_, row) => (
        <div className="flex justify-end">
          <Dropdown
            items={[
              { label: 'Edit User', icon: <Edit2 className="h-4 w-4" /> },
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
        title="Users"
        description="Manage system users and their roles."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add User
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
          />
          <Select
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Suspended', value: 'suspended' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:max-w-[160px]"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
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
