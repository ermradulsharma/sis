import { Input, type InputProps } from './Input';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, className, ...props }: SearchInputProps) {
  return (
    <Input
      type="text"
      value={value}
      placeholder="Search..."
      className={className}
      leftIcon={<Search className="h-4 w-4" />}
      rightIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full p-0.5 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
      {...props}
    />
  );
}
