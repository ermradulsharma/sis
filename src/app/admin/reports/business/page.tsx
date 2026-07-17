'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { apiService } from '@/services/api.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

export default function BusinessAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get<any>('/reports/business');
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch business analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ContentArea>
      <PageHeader
        title="Business Analytics"
        description="Operational health metrics across all modules."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Project Health */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-100">Project Health</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.projectHealth || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  className="capitalize"
                >
                  {(data?.projectHealth || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc', textTransform: 'capitalize' }}
                />
                <Legend className="capitalize" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-100">Lead Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.leadFunnel || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} className="capitalize" />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc', textTransform: 'capitalize' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workforce Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-medium text-slate-100">Workforce Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.workforceDistribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ContentArea>
  );
}
