'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { LeaveForm } from '@/features/hr/components/LeaveForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { Plus, Calendar, Clock } from 'lucide-react';
import type { TableColumn } from '@/types';
import { format } from 'date-fns';

export default function LeavePage() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        page,
        limit,
        totalPages,
        setTotalItems,
        handlePageChange,
        hasNextPage,
        hasPrevPage
    } = usePagination(1, 10);

    const fetchLeaves = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            const response = await apiService.get<any[]>(`/hr/leave?${params.toString()}`);

            if (response.success && response.data) {
                setLeaves(response.data);
                if (response.meta) {
                    setTotalItems(response.meta.total);
                }
            }
        } catch (error) {
            console.error('Failed to fetch leaves:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, setTotalItems]);

    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const columns: TableColumn<any>[] = [
        {
            key: 'employee',
            label: 'Employee',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    {row.employeeId ? (
                        <>
                            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-medium">
                                {row.employeeId.firstName.charAt(0)}{row.employeeId.lastName.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-200">{row.employeeId.firstName} {row.employeeId.lastName}</span>
                        </>
                    ) : (
                        <span className="text-sm text-slate-500 italic">Unknown</span>
                    )}
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (type: any) => (
                <Badge variant="default" className="capitalize">
                    {type}
                </Badge>
            ),
        },
        {
            key: 'dates',
            label: 'Date Range',
            render: (_, row) => (
                <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(row.startDate), 'MMM d, yy')} - {format(new Date(row.endDate), 'MMM d, yy')}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (status: any) => (
                <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                    {status}
                </Badge>
            ),
        },
        {
            key: 'reason',
            label: 'Reason',
            render: (reason: any) => (
                <span className="text-sm text-slate-400 line-clamp-1 max-w-[200px]">
                    {reason || <span className="italic text-slate-600">No reason provided</span>}
                </span>
            ),
        }
    ];

    return (
        <ContentArea>
            <PageHeader title="Leave Management" description="Submit and track time-off requests." actions={<Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>Request Time Off</Button>} />
            <DataTable columns={columns} data={leaves} isLoading={isLoading} pagination={{ page, totalPages, hasNextPage, hasPrevPage, onPageChange: handlePageChange, }} />
            <SlideOver isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Request Time Off" description="Submit a new leave request for approval."
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button onClick={() => document.getElementById('leave-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>Submit Request</Button>
                    </>
                }>
                <LeaveForm onSuccess={() => { setIsFormOpen(false); fetchLeaves(); }} onCancel={() => setIsFormOpen(false)} />
            </SlideOver>
        </ContentArea>
    );
}
