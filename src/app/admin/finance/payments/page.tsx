'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api.service';
import { Plus, Download } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';
import { SlideOver } from '@/components/ui/SlideOver';
import { PaymentForm } from '@/features/finance/components/PaymentForm';
import { exportToCSV } from '@/lib/csv';
import { BadgeVariant } from '@/components/ui/Badge';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const limit = 10;

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/finance/payments?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setPayments(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleCreatePayment = async (data: any) => {
    try {
      const res = await apiService.post('/finance/payments', data);
      if (res.success) {
        setIsFormOpen(false);
        fetchPayments();
      }
    } catch (error) {
      console.error('Failed to create payment:', error);
    }
  };

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'paymentDate',
      label: 'Date',
      render: (date: any) => <span className="text-sm font-medium text-slate-200">{format(new Date(date), 'MMM d, yyyy')}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount: any) => <span className="font-bold text-emerald-400">${amount.toFixed(2)}</span>,
    },
    {
      key: 'method',
      label: 'Method',
      render: (method: any) => <span className="text-sm capitalize">{method.replace('_', ' ')}</span>,
    },
    {
      key: 'referenceNumber',
      label: 'Reference',
      render: (ref: any) => <span className="text-sm text-slate-400">{ref || '-'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: any) => (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Payments Received"
        description="Track all incoming payments from customers."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => exportToCSV(payments, 'payments_export')}>
              Export
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
              Record Payment
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={payments}
        isLoading={isLoading}
        pagination={{
          page,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: page < Math.ceil(totalItems / limit),
          hasPrevPage: page > 1,
          onPageChange: setPage,
        }}
      />

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Record General Payment"
      >
        <PaymentForm onSubmit={handleCreatePayment} />
      </SlideOver>
    </ContentArea>
  );
}
