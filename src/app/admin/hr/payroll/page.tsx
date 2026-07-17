'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api.service';
import { Plus } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 10;

    const fetchPayrolls = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiService.get<any>(`/hr/payroll?page=${page}&limit=${limit}`);
            if (response.success && response.data) {
                setPayrolls(response.data);
                if (response.meta) {
                    setTotalItems(response.meta.total);
                }
            }
        } catch (error) {
            console.error('Failed to fetch payroll:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPayrolls();
    }, [fetchPayrolls]);

    const columns: TableColumn<any>[] = [
        {
            key: 'employeeId',
            label: 'Employee',
            render: (employeeId: any) => (
                <div>
                    <span className="font-medium text-slate-200">
                        {employeeId?.firstName} {employeeId?.lastName}
                    </span>
                    <p className="text-xs text-slate-400">{employeeId?.employeeId}</p>
                </div>
            ),
        },
        {
            key: 'month',
            label: 'Period',
            render: (month: any, row: any) => {
                const date = new Date(row.year, month - 1);
                return <span className="text-sm font-medium">{format(date, 'MMM yyyy')}</span>;
            },
        },
        {
            key: 'netPay',
            label: 'Net Pay',
            render: (netPay: any) => <span className="text-sm font-bold text-emerald-400">${netPay.toLocaleString()}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (status: any) => (
                <Badge variant={status === 'paid' ? 'success' : 'warning'}>
                    {status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
            ),
        },
    ];

    return (
        <ContentArea>
            <PageHeader title="Payroll" description="Manage employee salary and payment records." actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Generate Payroll</Button>} />
            <DataTable columns={columns} data={payrolls} isLoading={isLoading} pagination={{ page, totalPages: Math.ceil(totalItems / limit), hasNextPage: page < Math.ceil(totalItems / limit), hasPrevPage: page > 1, onPageChange: setPage, }} />
        </ContentArea>
    );
}
