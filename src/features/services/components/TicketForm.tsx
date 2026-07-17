'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const ticketSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['open', 'pending', 'resolved', 'closed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignedTo: z.string().optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TicketForm({ onSuccess, onCancel }: TicketFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<{label: string, value: string}[]>([]);
  const [users, setUsers] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, userRes] = await Promise.all([
          apiService.get<any[]>('/crm/customers?limit=100'),
          apiService.get<any[]>('/users?limit=100')
        ]);
        if (custRes.success && custRes.data) {
          setCustomers(custRes.data.map(c => ({ label: c.name, value: c._id })));
        }
        if (userRes.success && userRes.data) {
          setUsers(userRes.data.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u._id })));
        }
      } catch (e) {
        console.error("Failed to load select data", e);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      status: 'open',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    setError('');
    
    if (!data.assignedTo) delete data.assignedTo;

    try {
      const response = await apiService.post('/services/tickets', data);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create ticket');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="ticket-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <FormField label="Subject" error={errors.subject?.message} required>
        <Input {...register('subject')} placeholder="Brief summary of the issue..." />
      </FormField>

      <FormField label="Description" error={errors.description?.message} required>
        <textarea
          {...register('description')}
          rows={4}
          className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
          placeholder="Detailed explanation..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              options={[
                { label: 'Open', value: 'open' },
                { label: 'Pending', value: 'pending' },
                { label: 'Resolved', value: 'resolved' },
                { label: 'Closed', value: 'closed' },
              ]}
              error={errors.status?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Priority"
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ]}
              error={errors.priority?.message}
              required
              {...field}
            />
          )}
        />
      </div>

      <Controller
        name="assignedTo"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Assign Agent (Optional)"
            options={users}
            error={errors.assignedTo?.message}
            {...field}
          />
        )}
      />

      <button type="submit" className="hidden" />
    </form>
  );
}
