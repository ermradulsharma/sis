'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { apiService } from '@/services/api.service';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
  isPrimary: z.boolean(),
  customerId: z.string().optional(),
  leadId: z.string().optional(),
}).refine(data => data.customerId || data.leadId, {
  message: "Either Customer or Lead must be selected",
  path: ["customerId"],
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ContactForm({ onSuccess, onCancel }: ContactFormProps) {
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
          setLeads(leadRes.data.map(l => ({ label: `${l.firstName} ${l.lastName}`, value: l._id })));
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      isPrimary: false,
    },
  });

  const watchCustomer = watch('customerId');
  const watchLead = watch('leadId');

  useEffect(() => {
    if (watchCustomer) setValue('leadId', '');
  }, [watchCustomer, setValue]);

  useEffect(() => {
    if (watchLead) setValue('customerId', '');
  }, [watchLead, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError('');
    
    const payload = { ...data };
    if (!payload.customerId) delete payload.customerId;
    if (!payload.leadId) delete payload.leadId;

    try {
      const response = await apiService.post('/crm/contacts', payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error?.message || 'Failed to create contact');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" error={errors.firstName?.message} required>
          <Input {...register('firstName')} placeholder="Jane" />
        </FormField>
        <FormField label="Last Name" error={errors.lastName?.message} required>
          <Input {...register('lastName')} placeholder="Smith" />
        </FormField>
      </div>

      <FormField label="Email Address" error={errors.email?.message} required>
        <Input type="email" {...register('email')} placeholder="jane@example.com" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Phone Number" error={errors.phone?.message}>
          <Input type="tel" {...register('phone')} placeholder="+1 (555) 000-0000" />
        </FormField>
        <FormField label="Job Position" error={errors.position?.message}>
          <Input {...register('position')} placeholder="CTO" />
        </FormField>
      </div>

      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
        <p className="text-xs text-indigo-400 font-medium">Link to an entity (Choose one)</p>
        <Controller
          name="customerId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Customer Account"
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
              label="Lead Account"
              options={leads}
              error={errors.leadId?.message}
              disabled={!!watchCustomer}
              {...field}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="isPrimary" 
          {...register('isPrimary')} 
          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
        />
        <label htmlFor="isPrimary" className="text-sm font-medium text-slate-200">
          Mark as Primary Contact
        </label>
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
}
