'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api.service';
import { Plus } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';
import { BadgeVariant } from '@/components/ui/Badge';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/cms/blogs?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setBlogs(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (title: any) => <span className="font-medium text-slate-200">{title}</span>,
    },
    {
      key: 'author',
      label: 'Author',
      render: (author: any) => <span className="text-sm">{author?.name || 'Unknown'}</span>,
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
      key: 'createdAt',
      label: 'Created',
      render: (date: any) => <span className="text-sm text-slate-400">{format(new Date(date), 'MMM d, yyyy')}</span>,
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Blog Posts"
        description="Manage your website's blog content."
        actions={
          <div className="flex gap-2">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              New Post
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={blogs}
        isLoading={isLoading}
        pagination={{
          page,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: page < Math.ceil(totalItems / limit),
          hasPrevPage: page > 1,
          onPageChange: setPage,
        }}
      />
    </ContentArea>
  );
}
