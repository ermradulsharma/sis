/**
 * Application-wide constants.
 * Centralizes magic numbers, default values, and enum-like string sets.
 */

/** Default pagination settings for list endpoints. */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** Date/time format strings used throughout the application. */
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

/** Currency formatting defaults. */
export const CURRENCY = {
  DEFAULT: 'USD',
  LOCALE: 'en-US',
} as const;

/** Status labels and their corresponding badge colors. */
export const STATUS_CONFIG = {
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'warning' },
  suspended: { label: 'Suspended', color: 'error' },
  terminated: { label: 'Terminated', color: 'error' },
} as const;

/** Employment type labels. */
export const EMPLOYMENT_TYPES = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  contract: 'Contract',
  intern: 'Intern',
} as const;

/** Application metadata. */
export const APP_CONFIG = {
  name: 'SIS ERP',
  description: 'Enterprise Resource Planning for Software Companies',
  version: '1.0.0',
  company: 'SIS',
} as const;

/** Notification auto-dismiss durations (ms). */
export const TOAST_DURATION = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
} as const;

/** File upload constraints. */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;
