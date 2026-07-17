'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  industry: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CustomerForm({ onSuccess, onCancel }: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      status: 'active',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    setError('');
    
    // Clean up empty URL if any
    if (data.website === '') {
      delete data.website;
    }

    try {
      const response = await apiService.post('/crm/customers', data);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create customer');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <FormField label="Company / Customer Name" error={errors.name?.message} required>
        <Input {...register('name')} placeholder="Acme Corp" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Industry" error={errors.industry?.message}>
          <Input {...register('industry')} placeholder="Software, Retail, etc." />
        </FormField>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              error={errors.status?.message}
              required
              {...field}
            />
          )}
        />
      </div>

      <FormField label="Website" error={errors.website?.message}>
        <Input type="url" {...register('website')} placeholder="https://example.com" />
      </FormField>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Address Details</h3>
        
        <FormField label="Street Address" error={errors.address?.street?.message} className="mb-4">
          <Input {...register('address.street')} placeholder="123 Main St" />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField label="City" error={errors.address?.city?.message}>
            <Input {...register('address.city')} placeholder="New York" />
          </FormField>
          
          <FormField label="State / Province" error={errors.address?.state?.message}>
            <Input {...register('address.state')} placeholder="NY" />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Country" error={errors.address?.country?.message}>
            <Input {...register('address.country')} placeholder="USA" />
          </FormField>
          
          <FormField label="Zip Code" error={errors.address?.zipCode?.message}>
            <Input {...register('address.zipCode')} placeholder="10001" />
          </FormField>
        </div>
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
}
