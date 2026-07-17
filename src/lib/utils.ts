import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Merges Tailwind CSS class names, resolving conflicts.
 * Uses clsx for conditional class names + tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object for display.
 * @param date - Date to format
 * @param formatStr - date-fns format string (default: 'MMM dd, yyyy')
 */
export function formatDate(date: string | Date, formatStr = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

/**
 * Formats a date as relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Formats a number as currency.
 * @param amount - Numeric amount
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a large number with K/M/B suffixes for compact display.
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates user initials from a full name.
 * @param name - Full name (e.g., "John Doe")
 * @returns Initials (e.g., "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncates text to a maximum length with an ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Formats file size in human-readable units.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

/**
 * Builds URL query string from a params object. Omits undefined/null values.
 */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Deep clones a JSON-serializable value.
 */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Type-safe Object.keys that returns typed keys.
 */
export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Delays execution for a given number of milliseconds.
 * Useful for debounce patterns and testing.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
