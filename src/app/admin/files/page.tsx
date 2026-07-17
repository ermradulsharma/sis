'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { apiService } from '@/services/api.service';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  Folder, 
  File, 
  Image as ImageIcon, 
  FileText, 
  UploadCloud, 
  FolderPlus,
  MoreVertical,
  Download,
  Trash2,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';

export default function FileManagerPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await apiService.get<any[]>(`/files?${params.toString()}`);
      
      if (response.success && response.data) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string, isFolder: boolean) => {
    if (isFolder) return <Folder className="h-10 w-10 text-indigo-400" fill="currentColor" fillOpacity={0.2} />;
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-10 w-10 text-emerald-400" />;
    if (mimeType.includes('pdf')) return <FileText className="h-10 w-10 text-rose-400" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="h-10 w-10 text-blue-400" />;
    return <File className="h-10 w-10 text-slate-400" />;
  };

  return (
    <ContentArea>
      <PageHeader
        title="File Manager"
        description="Secure central repository for all company documents and assets."
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" leftIcon={<FolderPlus className="h-4 w-4" />}>
              New Folder
            </Button>
            <Button leftIcon={<UploadCloud className="h-4 w-4" />}>
              Upload File
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="w-full sm:max-w-md"
            placeholder="Search files and folders..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 py-32 text-center">
          <Folder className="h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No files found</h3>
          <p className="mt-1 text-sm text-slate-500">Upload documents or create folders to get started.</p>
          <Button className="mt-6" leftIcon={<UploadCloud className="h-4 w-4" />}>
            Upload your first file
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <div 
              key={file._id} 
              className="group relative flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:bg-slate-800/50"
            >
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Dropdown
                  trigger={<button className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-700"><MoreVertical className="h-4 w-4" /></button>}
                  items={[
                    { label: 'Download', icon: <Download className="h-4 w-4" /> },
                    { label: 'Rename', icon: <Edit2 className="h-4 w-4" /> },
                    { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true },
                  ]}
                />
              </div>

              {getFileIcon(file.mimeType, file.isFolder)}
              
              <h4 className="mt-4 w-full truncate text-center text-sm font-medium text-slate-200" title={file.name}>
                {file.name}
              </h4>
              
              <div className="mt-1 flex w-full items-center justify-center gap-2 text-xs text-slate-500">
                {!file.isFolder && <span>{formatSize(file.size)}</span>}
                {!file.isFolder && <span>•</span>}
                <span>{format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ContentArea>
  );
}
