'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  projectId: z.string().min(1, 'Project is required'),
  assigneeId: z.string().optional(),
  estimatedHours: z.number().min(0).optional().or(z.literal('')),
  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  projectId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ projectId, onSuccess, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<{label: string, value: string}[]>([]);
  const [users, setUsers] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          apiService.get<any[]>('/projects?limit=100'),
          apiService.get<any[]>('/users?limit=100')
        ]);
        if (projRes.success && projRes.data) {
          setProjects(projRes.data.map(p => ({ label: p.name, value: p._id })));
        }
        if (userRes.success && userRes.data) {
          setUsers(userRes.data.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u._id })));
        }
      } catch (e) {
        console.error("Failed to load relationships", e);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
      projectId: projectId || '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setError('');
    
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      estimatedHours: data.estimatedHours === '' ? undefined : Number(data.estimatedHours),
    };

    if (!payload.assigneeId) delete payload.assigneeId;

    try {
      const response = await apiService.post('/tasks', payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create task');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <Controller
        name="projectId"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Project"
            options={projects}
            error={errors.projectId?.message}
            required
            disabled={!!projectId} // Disable if created from within a specific project
            {...field}
          />
        )}
      />

      <FormField label="Task Title" error={errors.title?.message} required>
        <Input {...register('title')} placeholder="Design homepage mockup" />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
          placeholder="Acceptance criteria and details..."
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
                { label: 'To Do', value: 'todo' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'In Review', value: 'review' },
                { label: 'Done', value: 'done' },
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
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Assignee"
              options={users}
              error={errors.assigneeId?.message}
              {...field}
            />
          )}
        />

        <FormField label="Estimated Hours" error={errors.estimatedHours?.message}>
          <Input type="number" step="0.5" min="0" {...register('estimatedHours', { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Due Date" error={errors.dueDate?.message}>
        <Input type="date" {...register('dueDate')} />
      </FormField>

      <button type="submit" className="hidden" />
    </form>
  );
}
