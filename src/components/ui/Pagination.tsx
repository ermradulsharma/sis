import { Button } from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];
    // Show up to 5 page numbers, centered around current page if possible
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, 5);
      else if (end === totalPages) start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return { pages, start, end };
  };

  const { pages, start, end } = generatePages();

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="px-2"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {start > 1 && (
        <>
          <Button variant="ghost" size="sm" onClick={() => onPageChange(1)}>
            1
          </Button>
          {start > 2 && (
            <div className="px-1 text-slate-500">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          )}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(p)}
          className="w-9"
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <div className="px-1 text-slate-500">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="px-2"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
