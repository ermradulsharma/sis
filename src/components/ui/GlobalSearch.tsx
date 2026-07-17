'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Building2, FolderKanban, Package, FileText } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { useDebounce } from '@/hooks/useDebounce';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const res = await apiService.get<any[]>(`/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'customer': return <Building2 className="h-5 w-5 text-indigo-400" />;
      case 'project': return <FolderKanban className="h-5 w-5 text-emerald-400" />;
      case 'product': return <Package className="h-5 w-5 text-amber-400" />;
      case 'invoice': return <FileText className="h-5 w-5 text-rose-400" />;
      default: return <Search className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-block">Search...</span>
        <kbd className="hidden sm:inline-block rounded bg-slate-700 px-1.5 py-0.5 text-xs font-medium text-slate-300">Ctrl K</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh]">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          {/* Modal */}
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl mx-4">
            <div className="flex items-center border-b border-slate-700 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers, projects, products..."
                className="flex-1 bg-transparent px-4 py-4 text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
              {isSearching && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {results.length > 0 ? (
                <ul className="px-2">
                  {results.map((result) => (
                    <li key={`${result.type}-${result.id}`}>
                      <button
                        onClick={() => handleSelect(result.url)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium text-slate-200">{result.title}</p>
                          <p className="truncate text-xs text-slate-500 capitalize">{result.type} • {result.subtitle}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.length > 1 && !isSearching ? (
                <p className="px-6 py-8 text-center text-sm text-slate-500">No results found for "{query}"</p>
              ) : query.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-slate-500">
                  Type at least 2 characters to search across all modules.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
