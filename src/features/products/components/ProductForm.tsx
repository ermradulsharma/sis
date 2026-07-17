'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0),
  cost: z.number().min(0),
  stockQuantity: z.number().min(0),
  minStockLevel: z.number().min(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stockQuantity: 0,
      minStockLevel: 10,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await apiService.post('/products', data);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create product');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <FormField label="Product Name" error={errors.name?.message} required>
        <Input {...register('name')} placeholder="e.g. Ergonomic Office Chair" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="SKU (Optional)" error={errors.sku?.message}>
          <Input {...register('sku')} placeholder="Auto-generated if empty" />
        </FormField>
        
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Category"
              options={[
                { label: 'Hardware', value: 'hardware' },
                { label: 'Software', value: 'software' },
                { label: 'Services', value: 'services' },
                { label: 'Furniture', value: 'furniture' },
                { label: 'Consumables', value: 'consumables' },
              ]}
              error={errors.category?.message}
              required
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price ($)" error={errors.price?.message} required>
          <Input type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} />
        </FormField>
        
        <FormField label="Cost ($)" error={errors.cost?.message} required>
          <Input type="number" step="0.01" min="0" {...register('cost', { valueAsNumber: true })} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Initial Stock" error={errors.stockQuantity?.message} required>
          <Input type="number" min="0" {...register('stockQuantity', { valueAsNumber: true })} />
        </FormField>
        
        <FormField label="Min Stock Alert" error={errors.minStockLevel?.message} required>
          <Input type="number" min="0" {...register('minStockLevel', { valueAsNumber: true })} />
        </FormField>
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
}
