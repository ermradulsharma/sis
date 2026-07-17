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

export default function KnowledgeBasePage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 10;

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiService.get<any>(`/services/knowledge-base?page=${page}&limit=${limit}`);
            if (response.success && response.data) {
                setArticles(response.data);
                if (response.meta) {
                    setTotalItems(response.meta.total);
                }
            }
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const columns: TableColumn<any>[] = [
        {
            key: 'title',
            label: 'Title',
            render: (title: any) => <span className="font-medium text-slate-200">{title}</span>,
        },
        {
            key: 'category',
            label: 'Category',
            render: (category: any) => <span className="text-sm capitalize">{category}</span>,
        },
        {
            key: 'isInternal',
            label: 'Visibility',
            render: (isInternal: any) => (
                <Badge variant={isInternal ? 'warning' : 'success'}>
                    {isInternal ? 'Internal Only' : 'Public'}
                </Badge>
            ),
        },
        {
            key: 'authorId',
            label: 'Author',
            render: (author: any) => <span className="text-sm">{author?.name || 'Unknown'}</span>,
        },
        {
            key: 'updatedAt',
            label: 'Last Updated',
            render: (date: any) => <span className="text-sm text-slate-400">{format(new Date(date), 'MMM d, yyyy')}</span>,
        },
    ];

    return (
        <ContentArea>
            <PageHeader
                title="Knowledge Base"
                description="Manage help articles and internal documentation."
                actions={
                    <div className="flex gap-2">
                        <Button leftIcon={<Plus className="h-4 w-4" />}>
                            New Article
                        </Button>
                    </div>
                }
            />

            <DataTable
                columns={columns}
                data={articles}
                isLoading={isLoading}
                pagination={{
                    page,
                    totalPages: Math.ceil(totalItems / limit),
                    hasNextPage: page < Math.ceil(totalItems / limit),
                    hasPrevPage: page > 1,
                    onPageChange: setPage,
                }}
            />
        </ContentArea>
    );
}
