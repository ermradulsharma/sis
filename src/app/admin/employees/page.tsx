'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Edit2, Trash2, Building, Briefcase } from 'lucide-react';
import type { TableColumn, EmploymentType, EntityStatus } from '@/types';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const {
        page,
        limit,
        totalPages,
        setTotalItems,
        handlePageChange,
        hasNextPage,
        hasPrevPage
    } = usePagination(1, 10);

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (debouncedSearch) params.append('search', debouncedSearch);

            const response = await apiService.get<any[]>(`/employees?${params.toString()}`);

            if (response.success && response.data) {
                setEmployees(response.data);
                if (response.meta) setTotalItems(response.meta.total);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, debouncedSearch, setTotalItems]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        handlePageChange(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const getStatusBadge = (status: EntityStatus) => {
        switch (status) {
            case 'active': return <Badge variant="success">Active</Badge>;
            case 'inactive': return <Badge variant="default">Inactive</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    const columns: TableColumn<any>[] = [
        {
            key: 'name',
            label: 'Employee',
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <Avatar src={row.profilePicture} fallback={`${row.firstName} ${row.lastName}`} size="sm" />
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{row.firstName} {row.lastName}</span>
                        <span className="text-xs text-slate-500">{row.email}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'employeeId',
            label: 'EMP ID',
            render: (val) => <span className="font-mono text-xs text-slate-400">{val as string}</span>,
        },
        {
            key: 'department',
            label: 'Department',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-300">{row.department?.name || 'N/A'}</span>
                </div>
            ),
        },
        {
            key: 'designation',
            label: 'Designation',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-300">{row.designation?.title || row.designationId || 'N/A'}</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (status) => getStatusBadge(status as EntityStatus),
        },
        {
            key: 'actions',
            label: '',
            width: '60px',
            render: (_, row) => (
                <div className="flex justify-end">
                    <Dropdown
                        items={[
                            { label: 'Edit', icon: <Edit2 className="h-4 w-4" /> },
                            { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true },
                        ]}
                    />
                </div>
            ),
        },
    ];

    return (
        <ContentArea>
            <PageHeader
                title="Employees"
                description="Manage company employees and organizational structure."
                actions={
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        Add Employee
                    </Button>
                }
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-4">
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClear={() => setSearch('')}
                        className="w-full sm:max-w-xs"
                        placeholder="Search employees..."
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={employees}
                isLoading={isLoading}
                pagination={{
                    page,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    onPageChange: handlePageChange,
                }}
            />
        </ContentArea>
    );
}
