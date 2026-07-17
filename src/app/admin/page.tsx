'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { StatCard } from '@/components/data/StatCard';
import { ChartCard } from '@/components/data/ChartCard';
import { ActivityFeed } from '@/components/data/ActivityFeed';
import { Users, Briefcase, DollarSign, CheckSquare, Target, LifeBuoy, Package, CalendarOff } from 'lucide-react';
import { apiService } from '@/services/api.service';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [charts, setCharts] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const response = await apiService.get<any>('/dashboard/metrics');
                if (response.success && response.data) {
                    setMetrics(response.data.metrics);
                    setCharts(response.data.charts);
                }
            } catch (error) {
                console.error('Failed to load dashboard metrics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading || !metrics) {
        return (
            <ContentArea>
                <PageHeader title="Dashboard" description="Loading metrics..." />
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            </ContentArea>
        );
    }

    // Activity Feed Mock (Would be real in production)
    const mockActivities = [
        {
            id: '1',
            user: { name: 'System', avatar: null },
            action: 'update' as const,
            entity: 'Dashboard Metrics Initialized',
            timestamp: new Date().toISOString(),
        }
    ];

    return (
        <ContentArea>
            <PageHeader title="Command Center" description="Unified overview of your business performance across all modules." />
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Active Customers" value={metrics.totalCustomers.toString()} icon={<Users className="h-5 w-5" />} />
                <StatCard title="Pipeline Value" value={`$${metrics.pipelineValue.toLocaleString()}`} icon={<Target className="h-5 w-5" />} />
                <StatCard title="Active Projects" value={metrics.activeProjects.toString()} icon={<Briefcase className="h-5 w-5" />} />
                <StatCard title="Outstanding Invoices" value={`$${metrics.outstandingInvoices.toLocaleString()}`} icon={<DollarSign className="h-5 w-5 text-rose-400" />} />
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Open Support Tickets" value={metrics.openTickets.toString()} icon={<LifeBuoy className="h-5 w-5 text-amber-400" />} />
                <StatCard title="Low Stock Items" value={metrics.lowStockItems.toString()} icon={<Package className="h-5 w-5 text-rose-400" />} />
                <StatCard title="Pending Leaves" value={metrics.pendingLeaves.toString()} icon={<CalendarOff className="h-5 w-5 text-indigo-400" />} />
                <StatCard title="Overdue Tasks" value={metrics.overdueTasks.toString()} icon={<CheckSquare className="h-5 w-5 text-rose-400" />} />
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-4 space-y-6">
                    <ChartCard
                        title="Financial Performance"
                        description="Revenue vs. Expenses (Last 6 Months)"
                    >
                        <div className="h-72 w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpenses)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="Sales Pipeline Funnel"
                        description="Active deals by stage"
                    >
                        <div className="h-64 w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.pipeline} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        cursor={{ fill: '#1e293b' }}
                                    />
                                    <Bar dataKey="value" name="Deals" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <ChartCard
                        title="System Activity"
                        description="Latest automated system events"
                    >
                        <ActivityFeed activities={mockActivities} />
                    </ChartCard>
                </div>
            </div>
        </ContentArea>
    );
}
