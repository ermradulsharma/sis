'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSuccess, onCancel }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiService.get<any[]>('/crm/customers?limit=100');
        if (response.success && response.data) {
          setCustomers(response.data.map(c => ({ label: c.name, value: c._id })));
        }
      } catch (e) {
        console.error("Failed to load customers", e);
      }
    };
    fetchCustomers();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setError('');
    
    const payload = {
      ...data,
      issueDate: new Date(data.issueDate).toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
    };

    try {
      const response = await apiService.post('/finance/invoices', payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create invoice');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="invoice-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <Controller
        name="customerId"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Customer"
            options={customers}
            error={errors.customerId?.message}
            required
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Amount ($)" error={errors.amount?.message} required>
          <Input type="number" step="0.01" min="0" {...register('amount', { valueAsNumber: true })} />
        </FormField>
        
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Sent', value: 'sent' },
                { label: 'Paid', value: 'paid' },
                { label: 'Overdue', value: 'overdue' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
              error={errors.status?.message}
              required
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Issue Date" error={errors.issueDate?.message} required>
          <Input type="date" {...register('issueDate')} />
        </FormField>
        
        <FormField label="Due Date" error={errors.dueDate?.message} required>
          <Input type="date" {...register('dueDate')} />
        </FormField>
      </div>

      <FormField label="Notes" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={3}
          className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
          placeholder="Terms and conditions..."
        />
      </FormField>

      <button type="submit" className="hidden" />
    </form>
  );
}
