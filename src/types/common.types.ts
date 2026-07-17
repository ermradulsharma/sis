/**
 * Pagination parameters for list endpoints.
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination metadata returned from list endpoints.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Sort direction options.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort parameters for list queries.
 */
export interface SortParams {
  field: string;
  order: SortOrder;
}

/**
 * Generic filter parameter — key-value pairs used for query filtering.
 */
export type FilterParams = Record<string, string | string[] | undefined>;

/**
 * Combined query parameters for list endpoints (pagination + sort + filter + search).
 */
export interface ListQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  [key: string]: string | string[] | number | undefined;
}

/**
 * Entity status values used across modules.
 */
export type EntityStatus = 'active' | 'inactive';

/**
 * Employment types for employee records.
 */
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern';

/**
 * User account status.
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * Notification types for the notification center.
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Audit log action types.
 */
export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view' | 'export';

/**
 * Address object used across multiple entities.
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

/**
 * Base document fields shared by all MongoDB documents.
 */
export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generic select option for dropdowns.
 */
export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Table column definition for the DataTable component.
 */
export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

/**
 * Breadcrumb item for navigation.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
