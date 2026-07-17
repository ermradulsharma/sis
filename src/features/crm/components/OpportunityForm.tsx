'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const opportunitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.number().min(0, 'Value must be positive'),
  stage: z.enum(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
  probability: z.number().min(0).max(100),
  expectedCloseDate: z.string().optional(),
  customerId: z.string().optional(),
  leadId: z.string().optional(),
}).refine(data => data.customerId || data.leadId, {
  message: "Either Customer or Lead must be selected",
  path: ["customerId"], // highlight the customer field
});

export type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface OpportunityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function OpportunityForm({ onSuccess, onCancel }: OpportunityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [customers, setCustomers] = useState<{label: string, value: string}[]>([]);
  const [leads, setLeads] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, leadRes] = await Promise.all([
          apiService.get<any[]>('/crm/customers?limit=100'),
          apiService.get<any[]>('/crm/leads?limit=100')
        ]);
        
        if (custRes.success && custRes.data) {
          setCustomers(custRes.data.map(c => ({ label: c.name, value: c._id })));
        }
        if (leadRes.success && leadRes.data) {
          setLeads(leadRes.data.map(l => ({ label: `${l.firstName} ${l.lastName} ${l.companyName ? `(${l.companyName})` : ''}`, value: l._id })));
        }
      } catch (e) {
        console.error("Failed to load relations", e);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      stage: 'prospecting',
      probability: 10,
    },
  });

  // Ensure only one of Lead or Customer is selected
  const watchCustomer = watch('customerId');
  const watchLead = watch('leadId');

  useEffect(() => {
    if (watchCustomer) setValue('leadId', '');
  }, [watchCustomer, setValue]);

  useEffect(() => {
    if (watchLead) setValue('customerId', '');
  }, [watchLead, setValue]);

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);
    setError('');
    
    // Convert string to Date object
    const payload = {
      ...data,
      expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate).toISOString() : undefined,
    };

    // Remove empty strings
    if (!payload.customerId) delete payload.customerId;
    if (!payload.leadId) delete payload.leadId;

    try {
      const response = await apiService.post('/crm/opportunities', payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create opportunity');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="opportunity-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <FormField label="Opportunity Title" error={errors.title?.message} required>
        <Input {...register('title')} placeholder="e.g. Acme Corp Enterprise License" />
      </FormField>

      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
        <p className="text-xs text-indigo-400 font-medium">Link to a client (Choose one)</p>
        <Controller
          name="customerId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Existing Customer"
              options={customers}
              error={errors.customerId?.message}
              disabled={!!watchLead}
              {...field}
            />
          )}
        />
        <div className="text-center text-xs text-slate-500">OR</div>
        <Controller
          name="leadId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Unconverted Lead"
              options={leads}
              error={errors.leadId?.message}
              disabled={!!watchCustomer}
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Value ($)" error={errors.value?.message} required>
          <Input type="number" step="0.01" {...register('value', { valueAsNumber: true })} placeholder="10000" />
        </FormField>
        
        <FormField label="Probability (%)" error={errors.probability?.message} required>
          <Input type="number" min="0" max="100" {...register('probability', { valueAsNumber: true })} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="stage"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Pipeline Stage"
              options={[
                { label: 'Prospecting', value: 'prospecting' },
                { label: 'Qualification', value: 'qualification' },
                { label: 'Proposal', value: 'proposal' },
                { label: 'Negotiation', value: 'negotiation' },
                { label: 'Closed Won', value: 'closed-won' },
                { label: 'Closed Lost', value: 'closed-lost' },
              ]}
              error={errors.stage?.message}
              required
              {...field}
            />
          )}
        />

        <FormField label="Expected Close Date" error={errors.expectedCloseDate?.message}>
          <Input type="date" {...register('expectedCloseDate')} />
        </FormField>
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
}
