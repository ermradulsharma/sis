'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { apiService } from '@/services/api.service';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function RevenueReportsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get<any>('/reports/revenue');
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch revenue analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const kpis = data?.kpis || {};

  return (
    <ContentArea>
      <PageHeader
        title="Revenue & Financial Reports"
        description="Track financial health, revenue, expenses, and profit margins."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">YTD Revenue</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">${(kpis.ytdRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">YTD Expenses</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">${(kpis.ytdExpense || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Net Profit</p>
          <p className={`mt-2 text-3xl font-bold ${(kpis.netProfit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${(kpis.netProfit || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Profit Margin</p>
          <p className={`mt-2 text-3xl font-bold ${(kpis.profitMargin || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {(kpis.profitMargin || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue vs Expenses Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-medium text-slate-100">Revenue vs. Expenses (12 Months)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, undefined]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Unpaid Invoices */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-100">Accounts Receivable (Top 5 Unpaid)</h3>
          <div className="space-y-4">
            {(!data?.topUnpaid || data.topUnpaid.length === 0) ? (
              <p className="text-slate-400 text-sm">No unpaid invoices.</p>
            ) : (
              data.topUnpaid.map((inv: any) => (
                <div key={inv._id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div>
                    <p className="font-medium text-slate-200">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-400">{inv.customerId?.name || 'Unknown Client'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-400">${inv.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 capitalize">{inv.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ContentArea>
  );
}
