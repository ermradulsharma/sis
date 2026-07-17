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
import { ExpenseForm } from '@/features/finance/components/ExpenseForm';
import { exportToCSV } from '@/lib/csv';
import { BadgeVariant } from '@/components/ui/Badge';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const limit = 10;

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/finance/expenses?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setExpenses(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleCreateExpense = async (data: any) => {
    try {
      const res = await apiService.post('/finance/expenses', data);
      if (res.success) {
        setIsFormOpen(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'approved': return 'success';
      case 'reimbursed': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (title: any, row: any) => (
        <div>
          <span className="font-medium text-slate-200">{title}</span>
          <p className="text-xs text-slate-500 capitalize">{row.category.replace('_', ' ')}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount: any) => <span className="font-medium text-slate-200">${amount.toFixed(2)}</span>,
    },
    {
      key: 'expenseDate',
      label: 'Date',
      render: (date: any) => <span className="text-sm">{format(new Date(date), 'MMM d, yyyy')}</span>,
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
      key: 'incurredBy',
      label: 'Employee',
      render: (employee: any) => employee ? employee.name : <span className="text-slate-500 italic">Unassigned</span>,
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Company Expenses"
        description="Track and manage internal business expenses."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => exportToCSV(expenses, 'expenses_export')}>
              Export
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
              Record Expense
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={expenses}
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
        title="Record New Expense"
      >
        <ExpenseForm onSubmit={handleCreateExpense} />
      </SlideOver>
    </ContentArea>
  );
}
