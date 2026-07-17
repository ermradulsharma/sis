'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'converted']),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LeadForm({ onSuccess, onCancel }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'new',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await apiService.post('/crm/leads', data);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create lead');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="lead-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" error={errors.firstName?.message} required>
          <Input {...register('firstName')} placeholder="John" />
        </FormField>

        <FormField label="Last Name" error={errors.lastName?.message} required>
          <Input {...register('lastName')} placeholder="Doe" />
        </FormField>
      </div>

      <FormField label="Email Address" error={errors.email?.message} required>
        <Input type="email" {...register('email')} placeholder="john@example.com" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Phone Number" error={errors.phone?.message}>
          <Input type="tel" {...register('phone')} placeholder="+1 (555) 000-0000" />
        </FormField>

        <FormField label="Company Name" error={errors.companyName?.message}>
          <Input {...register('companyName')} placeholder="Acme Corp" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              options={[
                { label: 'New', value: 'new' },
                { label: 'Contacted', value: 'contacted' },
                { label: 'Qualified', value: 'qualified' },
              ]}
              error={errors.status?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Source"
              options={[
                { label: 'Website', value: 'Website' },
                { label: 'Referral', value: 'Referral' },
                { label: 'Cold Call', value: 'Cold Call' },
                { label: 'Event', value: 'Event' },
              ]}
              error={errors.source?.message}
              {...field}
            />
          )}
        />
      </div>

      <FormField label="Notes" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={3}
          className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
          placeholder="Any initial thoughts or requirements..."
        />
      </FormField>

      {/* Hidden submit button to allow form submission on enter, actual buttons are in SlideOver footer */}
      <button type="submit" className="hidden" />
    </form>
  );
}
