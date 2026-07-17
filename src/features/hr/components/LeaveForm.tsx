'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const leaveSchema = z.object({
  type: z.enum(['sick', 'vacation', 'personal', 'unpaid']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().optional(),
});

export type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LeaveForm({ onSuccess, onCancel }: LeaveFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      type: 'vacation',
    },
  });

  const onSubmit = async (data: LeaveFormData) => {
    setIsSubmitting(true);
    setError('');
    
    const payload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    try {
      const response = await apiService.post('/hr/leave', payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to submit leave request');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="leave-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Leave Type"
            options={[
              { label: 'Vacation', value: 'vacation' },
              { label: 'Sick Leave', value: 'sick' },
              { label: 'Personal Time Off', value: 'personal' },
              { label: 'Unpaid Leave', value: 'unpaid' },
            ]}
            error={errors.type?.message}
            required
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" error={errors.startDate?.message} required>
          <Input type="date" {...register('startDate')} />
        </FormField>
        
        <FormField label="End Date" error={errors.endDate?.message} required>
          <Input type="date" {...register('endDate')} />
        </FormField>
      </div>

      <FormField label="Reason (Optional)" error={errors.reason?.message}>
        <textarea
          {...register('reason')}
          rows={4}
          className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
          placeholder="I will be taking time off for..."
        />
      </FormField>

      <button type="submit" className="hidden" />
    </form>
  );
}
