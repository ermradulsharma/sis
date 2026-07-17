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

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/cms/faqs?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setFaqs(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch faqs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const columns: TableColumn<any>[] = [
    {
      key: 'question',
      label: 'Question',
      render: (q: any) => <span className="font-medium text-slate-200">{q}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      render: (cat: any) => <span className="text-sm capitalize">{cat}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive: any) => (
        <Badge variant={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (order: any) => <span className="text-sm text-slate-400">{order}</span>,
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions for the help center."
        actions={
          <div className="flex gap-2">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add FAQ
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={faqs}
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
