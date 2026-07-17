'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { SlideOver } from '@/components/ui/SlideOver';
import { ContactForm } from '@/features/crm/components/ContactForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Mail, Phone, Building2, UserPlus, Star } from 'lucide-react';
import type { TableColumn } from '@/types';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
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

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/crm/contacts?${params.toString()}`);
      
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
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 relative">
            {row.firstName.charAt(0)}{row.lastName.charAt(0)}
            {row.isPrimary && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                <Star className="h-3 w-3 text-white fill-current" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-slate-200">{row.firstName} {row.lastName}</div>
            {row.position && (
              <div className="text-xs text-slate-500 mt-0.5">{row.position}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Mail className="h-3.5 w-3.5" /> {row.email}
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Phone className="h-3.5 w-3.5" /> {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'linkedEntity',
      label: 'Linked To',
      render: (_, row) => (
        <div className="flex items-center gap-2 text-sm">
          {row.customerId ? (
            <>
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span className="text-slate-300">{row.customerId.name} <span className="text-slate-500 ml-1">(Customer)</span></span>
            </>
          ) : row.leadId ? (
            <>
              <UserPlus className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300">{row.leadId.firstName} {row.leadId.lastName} <span className="text-slate-500 ml-1">(Lead)</span></span>
            </>
          ) : (
            <span className="text-slate-500 italic">Unlinked</span>
          )}
        </div>
      ),
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Contacts Directory"
        description="Manage all individuals associated with your customers and leads."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            Add Contact
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
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
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
        title="Add New Contact"
        description="Create a new contact and link them to a customer or lead."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('contact-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Save Contact
            </Button>
          </>
        }
      >
        <ContactForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchContacts();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
