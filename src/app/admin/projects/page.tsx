'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { SlideOver } from '@/components/ui/SlideOver';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, MoreHorizontal, Calendar, Users, Building2 } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
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

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/projects?${params.toString()}`);
      
      if (response.success && response.data) {
        setProjects(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'on-hold': return 'warning';
      case 'completed': return 'default';
      case 'planning': return 'info';
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
      key: 'name',
      label: 'Project Name',
      render: (_, row) => (
        <div>
          <div className="font-medium text-slate-200">{row.name}</div>
          {row.customerId && (
            <div className="flex items-center text-xs text-slate-500 mt-0.5">
              <Building2 className="h-3 w-3 mr-1" /> {row.customerId.name}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: any) => (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {status.replace('-', ' ')}
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
      key: 'timeline',
      label: 'Timeline',
      render: (_, row) => (
        <div className="text-sm text-slate-400">
          {row.startDate || row.endDate ? (
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {row.startDate ? format(new Date(row.startDate), 'MMM d, yy') : 'TBD'} 
              {' - '} 
              {row.endDate ? format(new Date(row.endDate), 'MMM d, yy') : 'TBD'}
            </div>
          ) : (
            <span className="italic text-slate-500">No dates set</span>
          )}
        </div>
      ),
    },
    {
      key: 'manager',
      label: 'Manager',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.managerId ? (
            <>
              <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-medium">
                {row.managerId.firstName.charAt(0)}{row.managerId.lastName.charAt(0)}
              </div>
              <span className="text-sm text-slate-300">{row.managerId.firstName} {row.managerId.lastName}</span>
            </>
          ) : (
            <span className="text-sm text-slate-500 italic">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${row._id}`)}>
            Open Project
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
        title="Projects"
        description="Manage active projects, timelines, and team assignments."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            New Project
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
            placeholder="Search projects..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
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
        title="Create New Project"
        description="Initialize a new project and assign a manager."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('project-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Create Project
            </Button>
          </>
        }
      >
        <ProjectForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchProjects();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
