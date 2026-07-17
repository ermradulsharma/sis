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

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/products/categories?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setCategories(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Category Name',
      render: (name: any) => <span className="font-medium text-slate-200">{name}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (desc: any) => <span className="text-sm text-slate-400">{desc || '—'}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive: any) => (
        <Badge variant={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Product Categories"
        description="Manage categories for your product catalog."
        actions={
          <div className="flex gap-2">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Category
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
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
