import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than zero'),
  paymentDate: z.string(),
  method: z.enum(['credit_card', 'bank_transfer', 'cash', 'check']),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  initialData?: Partial<PaymentFormData>;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  isLoading?: boolean;
}

export function PaymentForm({ initialData, onSubmit, isLoading }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      paymentDate: initialData?.paymentDate || new Date().toISOString().split('T')[0],
      method: initialData?.method || 'bank_transfer',
      referenceNumber: initialData?.referenceNumber || '',
      notes: initialData?.notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.amount && <p className="mt-1 text-sm text-rose-500">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Payment Date</label>
          <input
            type="date"
            {...register('paymentDate')}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.paymentDate && <p className="mt-1 text-sm text-rose-500">{errors.paymentDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Payment Method</label>
          <select
            {...register('method')}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
          </select>
          {errors.method && <p className="mt-1 text-sm text-rose-500">{errors.method.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">Reference Number</label>
          <input
            type="text"
            {...register('referenceNumber')}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Transaction ID"
          />
          {errors.referenceNumber && <p className="mt-1 text-sm text-rose-500">{errors.referenceNumber.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">Notes (Optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Any additional details..."
        />
        {errors.notes && <p className="mt-1 text-sm text-rose-500">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" isLoading={isLoading}>
          Record Payment
        </Button>
      </div>
    </form>
  );
}
