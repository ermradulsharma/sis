'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import type { TableColumn } from '@/types';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
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

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/departments?${params.toString()}`);
      
      if (response.success && response.data) {
        setDepartments(response.data);
        if (response.meta) setTotalItems(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Department Name',
      sortable: true,
      render: (name, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">{name as string}</span>
          <span className="text-xs text-slate-500">{row.description || 'No description'}</span>
        </div>
      ),
    },
    {
      key: 'parentDepartment',
      label: 'Parent',
      render: (_, row) => (
        <span className="text-slate-400">
          {row.parentDepartment ? row.parentDepartment.name : '-'}
        </span>
      ),
    },
    {
      key: 'manager',
      label: 'Manager',
      render: (_, row) => (
        <span className="text-slate-300">
          {row.manager ? `${row.manager.firstName} ${row.manager.lastName}` : 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'employeeCount',
      label: 'Employees',
      render: (count) => (
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users className="h-4 w-4" />
          <span>{count as number}</span>
        </div>
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
        title="Departments"
        description="Organize your company into functional groups."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Department
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
            placeholder="Search departments..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={departments}
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
