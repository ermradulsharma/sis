'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api.service';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';
import { BadgeVariant } from '@/components/ui/Badge';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/cms/contacts?page=${page}&limit=${limit}`);
      if (response.success && response.data) {
        setContacts(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'new': return 'error';
      case 'read': return 'warning';
      case 'replied': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Sender',
      render: (name: any, row: any) => (
        <div>
          <span className="font-medium text-slate-200">{name}</span>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (subject: any) => <span className="text-sm font-medium">{subject}</span>,
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
      label: 'Date',
      render: (date: any) => <span className="text-sm text-slate-400">{format(new Date(date), 'MMM d, yyyy HH:mm')}</span>,
    },
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Contact Messages"
        description="Inbox for public contact form submissions."
      />

      <DataTable
        columns={columns}
        data={contacts}
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
