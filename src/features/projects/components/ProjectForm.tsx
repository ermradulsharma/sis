'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customerId: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
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
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'planning',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setError('');
    
    const payload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };

    if (!payload.customerId) delete payload.customerId;

    try {
      const response = await apiService.post('/projects', payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <FormField label="Project Name" error={errors.name?.message} required>
        <Input {...register('name')} placeholder="Website Redesign 2024" />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
          placeholder="Brief description of the project goals..."
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
                { label: 'Planning', value: 'planning' },
                { label: 'Active', value: 'active' },
                { label: 'On Hold', value: 'on-hold' },
                { label: 'Completed', value: 'completed' },
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

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" error={errors.startDate?.message}>
          <Input type="date" {...register('startDate')} />
        </FormField>
        
        <FormField label="End Date" error={errors.endDate?.message}>
          <Input type="date" {...register('endDate')} />
        </FormField>
      </div>

      <Controller
        name="customerId"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Client / Customer (Optional)"
            options={customers}
            error={errors.customerId?.message}
            {...field}
          />
        )}
      />

      <button type="submit" className="hidden" />
    </form>
  );
}
