/**
 * Module registry for enabling/disabling ERP modules.
 *
 * When a module is disabled, its navigation items, routes, and API endpoints
 * are excluded from the application. This allows incremental module activation
 * as the ERP grows.
 */

export interface ModuleConfig {
  /** Unique module identifier. */
  id: string;
  /** Human-readable module name. */
  name: string;
  /** Brief description of the module's purpose. */
  description: string;
  /** Whether the module is currently active. */
  enabled: boolean;
  /** Route prefix for this module's pages. */
  basePath: string;
  /** Icon name from Lucide React. */
  icon: string;
}

export const MODULES: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Centralized overview with KPIs, charts, and quick actions',
    enabled: true,
    basePath: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'core',
    name: 'Core',
    description: 'Users, roles, employees, departments, branches, and system settings',
    enabled: true,
    basePath: '',
    icon: 'Settings',
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Leads, customers, contacts, sales pipeline, and follow-ups',
    enabled: true,
    basePath: '/crm',
    icon: 'Users',
  },
  {
    id: 'projects',
    name: 'Project Management',
    description: 'Projects, milestones, tasks, sprints, and time tracking',
    enabled: true,
    basePath: '/projects',
    icon: 'FolderKanban',
  },
  {
    id: 'products',
    name: 'Product Management',
    description: 'Products, categories, versions, licensing, and releases',
    enabled: true,
    basePath: '/products',
    icon: 'Package',
  },
  {
    id: 'services',
    name: 'Service Management',
    description: 'Support tickets, SLA management, and knowledge base',
    enabled: true,
    basePath: '/services',
    icon: 'Headphones',
  },
  {
    id: 'hr',
    name: 'HRMS',
    description: 'Attendance, leave, payroll, holidays, and performance reviews',
    enabled: true,
    basePath: '/hr',
    icon: 'UserCog',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Invoices, expenses, payments, revenue, and financial reports',
    enabled: true,
    basePath: '/finance',
    icon: 'DollarSign',
  },
  {
    id: 'cms',
    name: 'CMS',
    description: 'Pages, blogs, media library, FAQs, and testimonials',
    enabled: true,
    basePath: '/cms',
    icon: 'FileText',
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Business analytics, revenue, employee, project, and client reports',
    enabled: true,
    basePath: '/reports',
    icon: 'BarChart3',
  },
];

/**
 * Returns only the enabled modules.
 */
export function getEnabledModules(): ModuleConfig[] {
  return MODULES.filter((m) => m.enabled);
}

/**
 * Checks if a specific module is enabled.
 */
export function isModuleEnabled(moduleId: string): boolean {
  return MODULES.some((m) => m.id === moduleId && m.enabled);
}
