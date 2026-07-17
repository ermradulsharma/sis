'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { SearchInput } from '@/components/ui/SearchInput';
import { InvoiceForm } from '@/features/finance/components/InvoiceForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, FileText, Calendar, DollarSign, Download } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';
import { generatePDF } from '@/lib/pdf';

export default function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
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

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/finance/invoices?${params.toString()}`);
      
      if (response.success && response.data) {
        setInvoices(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'sent': return 'info';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'invoice',
      label: 'Invoice',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-slate-200">{row.invoiceNumber}</div>
            <div className="text-xs text-slate-500 mt-0.5">{row.customerId?.name || 'Unknown Customer'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (_, row) => (
        <div className="flex items-center text-slate-200 font-medium">
          <DollarSign className="h-4 w-4 text-emerald-500 mr-0.5" />
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      ),
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
      key: 'dates',
      label: 'Timeline',
      render: (_, row) => (
        <div className="text-sm text-slate-400">
          <div className="flex items-center mb-1">
            <span className="w-12 text-slate-500 text-xs uppercase tracking-wider">Issued</span>
            {format(new Date(row.issueDate), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <span className="w-12 text-slate-500 text-xs uppercase tracking-wider">Due</span>
            <span className={row.status === 'overdue' ? 'text-rose-400 font-medium' : ''}>
              {format(new Date(row.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => {
              // Creating a temporary hidden element for the invoice just for PDF generation
              const tempDiv = document.createElement('div');
              tempDiv.id = `invoice-pdf-${row._id}`;
              tempDiv.className = "bg-white p-8 text-black";
              tempDiv.innerHTML = `
                <div style="max-width: 800px; margin: 0 auto; font-family: sans-serif;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                    <div>
                      <h1 style="font-size: 24px; font-weight: bold; margin: 0;">INVOICE</h1>
                      <p style="color: #666; margin-top: 5px;">${row.invoiceNumber}</p>
                    </div>
                    <div style="text-align: right;">
                      <h2 style="font-size: 18px; margin: 0;">Your Company Name</h2>
                      <p style="color: #666; margin-top: 5px; font-size: 14px;">123 Business Rd.<br>City, State 12345</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                    <div>
                      <h3 style="font-size: 14px; color: #666; margin-bottom: 5px; text-transform: uppercase;">Bill To:</h3>
                      <p style="font-weight: bold; margin: 0;">${row.customerId?.name || 'Customer'}</p>
                    </div>
                    <div style="text-align: right;">
                      <div style="margin-bottom: 10px;">
                        <span style="color: #666; display: inline-block; width: 100px;">Issue Date:</span>
                        <span style="font-weight: bold;">${format(new Date(row.issueDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div>
                        <span style="color: #666; display: inline-block; width: 100px;">Due Date:</span>
                        <span style="font-weight: bold;">${format(new Date(row.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                    <thead>
                      <tr style="border-bottom: 2px solid #eee;">
                        <th style="text-align: left; padding: 10px 0; color: #666;">Description</th>
                        <th style="text-align: right; padding: 10px 0; color: #666;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 15px 0;">Professional Services</td>
                        <td style="text-align: right; padding: 15px 0;">$${row.amount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 300px;">
                      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 2px solid #000;">
                        <span style="font-weight: bold;">Total Due:</span>
                        <span style="font-weight: bold; font-size: 18px;">$${row.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  ${row.notes ? `<div style="margin-top: 40px; color: #666; font-size: 14px;"><p><strong>Notes:</strong><br>${row.notes}</p></div>` : ''}
                </div>
              `;
              document.body.appendChild(tempDiv);
              
              generatePDF(`invoice-pdf-${row._id}`, `${row.invoiceNumber}.pdf`).then(() => {
                document.body.removeChild(tempDiv);
              });
            }}
          >
            PDF
          </Button>
        </div>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Finance & Invoicing"
        description="Manage customer invoices and track revenue."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            Create Invoice
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
            placeholder="Search by invoice number..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
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
        title="Create Invoice"
        description="Draft a new invoice to send to a customer."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('invoice-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Save Invoice
            </Button>
          </>
        }
      >
        <InvoiceForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchInvoices();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
