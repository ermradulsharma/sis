'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  accept?: string;
  maxSizeMB?: number;
  currentFile?: string | File | null;
  className?: string;
  error?: string;
}

export function FileUpload({
  onFileSelect,
  onClear,
  accept,
  maxSizeMB = 10,
  currentFile,
  className,
  error,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }
    onFileSelect(file);
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    if (onClear) onClear();
  };

  return (
    <div className={className}>
      {currentFile ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileIcon className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="truncate text-sm font-medium text-slate-200">
                {typeof currentFile === 'string' ? currentFile.split('/').pop() : currentFile.name}
              </p>
              <p className="text-xs text-slate-400">Ready to upload</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500',
            error && 'border-rose-500/50 bg-rose-500/5',
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
            <UploadCloud className="h-6 w-6 text-slate-400" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-200">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400">
            Max file size: {maxSizeMB}MB
          </p>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
