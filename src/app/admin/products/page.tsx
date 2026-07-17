'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { DataTable } from '@/components/data/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { SearchInput } from '@/components/ui/SearchInput';
import { ProductForm } from '@/features/products/components/ProductForm';
import { apiService } from '@/services/api.service';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import type { TableColumn } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/products?${params.toString()}`);
      
      if (response.success && response.data) {
        setProducts(response.data);
        if (response.meta) {
          setTotalItems(response.meta.total);
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, setTotalItems]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const columns: TableColumn<any>[] = [
    {
      key: 'product',
      label: 'Product Details',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-slate-200">{row.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">SKU: {row.sku} • <span className="capitalize">{row.category}</span></div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (_, row) => (
        <span className="font-medium text-slate-300">${row.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock Levels',
      render: (_, row) => {
        const isLow = row.stockQuantity <= row.minStockLevel;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isLow ? 'text-rose-400' : 'text-slate-300'}`}>
              {row.stockQuantity} in stock
            </span>
            {isLow && (
              <Badge variant="error" className="py-0.5 px-1.5 h-auto text-[10px] uppercase">
                <AlertTriangle className="h-3 w-3 mr-1 inline" /> Low
              </Badge>
            )}
          </div>
        );
      },
    }
  ];

  return (
    <ContentArea>
      <PageHeader
        title="Product Inventory"
        description="Manage your product catalog and track inventory levels."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            Add Product
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="w-full sm:max-w-md"
            placeholder="Search products by name or SKU..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        pagination={{
          page,
          totalPages,
          hasNextPage,
          hasPrevPage,
          onPageChange: handlePageChange,
        }}
      />

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New Product"
        description="Create a new item in your inventory catalog."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('product-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Save Product
            </Button>
          </>
        }
      >
        <ProductForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchProducts();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
