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
import { TaskForm } from '@/features/projects/components/TaskForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, MoreHorizontal, FolderKanban, Clock } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';

export default function GlobalTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
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

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/tasks?${params.toString()}`);
      
      if (response.success && response.data) {
        setTasks(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'done': return 'success';
      case 'review': return 'warning';
      case 'in-progress': return 'info';
      case 'todo': return 'default';
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
      key: 'title',
      label: 'Task',
      render: (_, row) => (
        <div>
          <div className="font-medium text-slate-200">{row.title}</div>
          <div className="flex items-center text-xs text-slate-500 mt-0.5">
            <span className={`capitalize font-medium ${getPriorityColor(row.priority)} mr-2`}>
              {row.priority}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.projectId ? (
            <>
              <FolderKanban className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-300 hover:text-indigo-400 hover:underline cursor-pointer" onClick={() => router.push(`/projects/${row.projectId}`)}>
                View Project
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-500 italic">No Project</span>
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
      key: 'dueDate',
      label: 'Due Date',
      render: (_, row) => (
        <div className="text-sm text-slate-400">
          {row.dueDate ? format(new Date(row.dueDate), 'MMM d, yyyy') : <span className="italic">No due date</span>}
        </div>
      ),
    },
    {
      key: 'assignee',
      label: 'Assignee',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.assigneeId ? (
            <>
              <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-medium">
                {row.assigneeId.firstName.charAt(0)}{row.assigneeId.lastName.charAt(0)}
              </div>
              <span className="text-sm text-slate-300">{row.assigneeId.firstName} {row.assigneeId.lastName}</span>
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
          <Button variant="ghost" size="sm" leftIcon={<MoreHorizontal className="h-4 w-4" />}>
          </Button>
        </div>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="All Tasks"
        description="Global view of tasks across all projects."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            New Task
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
            placeholder="Search tasks..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
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
        title="Create New Task"
        description="Add a task to a project and assign it to a team member."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('task-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Create Task
            </Button>
          </>
        }
      >
        <TaskForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchTasks();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
