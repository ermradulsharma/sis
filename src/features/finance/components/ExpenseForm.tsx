import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';

const expenseSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  category: z.enum(['software', 'travel', 'office_supplies', 'marketing', 'other']),
  expenseDate: z.string(),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ExpenseForm({ initialData, onSubmit, isLoading }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData?.amount || 0,
      category: initialData?.category || 'other',
      expenseDate: initialData?.expenseDate || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300">Expense Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Monthly GitHub Copilot Subscription"
        />
        {errors.title && <p className="mt-1 text-sm text-rose-500">{errors.title.message}</p>}
      </div>

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
          <label className="block text-sm font-medium text-slate-300">Category</label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="software">Software</option>
            <option value="travel">Travel</option>
            <option value="office_supplies">Office Supplies</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-rose-500">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">Expense Date</label>
        <input
          type="date"
          {...register('expenseDate')}
          className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.expenseDate && <p className="mt-1 text-sm text-rose-500">{errors.expenseDate.message}</p>}
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
          {initialData ? 'Update Expense' : 'Submit Expense'}
        </Button>
      </div>
    </form>
  );
}
