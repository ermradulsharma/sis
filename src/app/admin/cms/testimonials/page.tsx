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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/cms/testimonials?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setTestimonials(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const columns: TableColumn<any>[] = [
    {
      key: 'clientName',
      label: 'Client',
      render: (name: any, row: any) => (
        <div>
          <span className="font-medium text-slate-200">{name}</span>
          <p className="text-xs text-slate-500">{row.role ? `${row.role}, ` : ''}{row.company}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (rating: any) => <span className="text-yellow-400 font-bold">{rating} / 5</span>,
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (isFeatured: any) => (
        <Badge variant={isFeatured ? 'success' : 'default'}>
          {isFeatured ? 'Featured' : 'Standard'}
        </Badge>
      ),
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Testimonials"
        description="Manage customer reviews and testimonials."
        actions={
          <div className="flex gap-2">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Testimonial
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={testimonials}
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
