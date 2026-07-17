/**
 * Config-driven sidebar navigation.
 *
 * The Sidebar component reads this configuration to render navigation items.
 * Each item may specify a `permission` for RBAC filtering and a `moduleId`
 * for module-level gating. Items without a permission are visible to all
 * authenticated users.
 */

export interface NavItem {
  /** Display label. */
  label: string;
  /** Route path. */
  href?: string;
  /** Lucide React icon name. */
  icon?: string;
  /** Permission required to see this item. */
  permission?: string;
  /** Module this item belongs to (for module-level gating). */
  moduleId?: string;
  /** Nested navigation items. */
  children?: NavItem[];
  /** Badge text (e.g., count of pending items). */
  badge?: string;
}

export interface NavSection {
  /** Section heading displayed above the group. */
  title?: string;
  /** Navigation items in this section. */
  items: NavItem[];
}

export const NAVIGATION: NavSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
        permission: 'dashboard:stats:read',
        moduleId: 'dashboard',
      },
    ],
  },
  {
    title: 'Core',
    items: [
      {
        label: 'Users',
        href: '/users',
        icon: 'Users',
        permission: 'core:users:read',
        moduleId: 'core',
      },
      {
        label: 'Roles & Permissions',
        href: '/roles',
        icon: 'Shield',
        permission: 'core:roles:read',
        moduleId: 'core',
      },
      {
        label: 'Employees',
        href: '/employees',
        icon: 'UserCheck',
        permission: 'core:employees:read',
        moduleId: 'core',
      },
      {
        label: 'Departments',
        href: '/departments',
        icon: 'Building2',
        permission: 'core:departments:read',
        moduleId: 'core',
      },
      {
        label: 'Branches',
        href: '/branches',
        icon: 'MapPin',
        permission: 'core:branches:read',
        moduleId: 'core',
      },
      {
        label: 'Company Settings',
        href: '/company-settings',
        icon: 'Settings',
        permission: 'core:settings:read',
        moduleId: 'core',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Notifications',
        href: '/notifications',
        icon: 'Bell',
        moduleId: 'core',
      },
      {
        label: 'Activity Logs',
        href: '/activity-logs',
        icon: 'ScrollText',
        permission: 'core:activity-logs:read',
        moduleId: 'core',
      },
      {
        label: 'File Manager',
        href: '/file-manager',
        icon: 'FolderOpen',
        permission: 'core:files:read',
        moduleId: 'core',
      },
    ],
  },
  {
    title: 'CRM',
    items: [
      {
        label: 'Leads',
        href: '/crm/leads',
        icon: 'UserPlus',
        permission: 'crm:leads:read',
        moduleId: 'crm',
      },
      {
        label: 'Customers',
        href: '/crm/customers',
        icon: 'Building',
        permission: 'crm:customers:read',
        moduleId: 'crm',
      },
      {
        label: 'Contacts',
        href: '/crm/contacts',
        icon: 'Contact',
        permission: 'crm:contacts:read',
        moduleId: 'crm',
      },
      {
        label: 'Sales Pipeline',
        href: '/crm/pipeline',
        icon: 'GitBranchPlus',
        permission: 'crm:pipeline:read',
        moduleId: 'crm',
      },
      {
        label: 'Quotations',
        href: '/crm/quotations',
        icon: 'FileSpreadsheet',
        permission: 'crm:quotations:read',
        moduleId: 'crm',
      },
    ],
  },
  {
    title: 'Projects',
    items: [
      {
        label: 'All Projects',
        href: '/projects',
        icon: 'FolderKanban',
        permission: 'projects:projects:read',
        moduleId: 'projects',
      },
      {
        label: 'Tasks',
        href: '/projects/tasks',
        icon: 'CheckSquare',
        permission: 'projects:tasks:read',
        moduleId: 'projects',
      },
      {
        label: 'Time Tracking',
        href: '/projects/time-tracking',
        icon: 'Clock',
        permission: 'projects:time-tracking:read',
        moduleId: 'projects',
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        label: 'All Products',
        href: '/products',
        icon: 'Package',
        permission: 'products:products:read',
        moduleId: 'products',
      },
      {
        label: 'Categories',
        href: '/products/categories',
        icon: 'Tags',
        permission: 'products:categories:read',
        moduleId: 'products',
      },
    ],
  },
  {
    title: 'Services',
    items: [
      {
        label: 'Support Tickets',
        href: '/services/tickets',
        icon: 'Ticket',
        permission: 'services:tickets:read',
        moduleId: 'services',
      },
      {
        label: 'Knowledge Base',
        href: '/services/knowledge-base',
        icon: 'BookOpen',
        permission: 'services:knowledge-base:read',
        moduleId: 'services',
      },
    ],
  },
  {
    title: 'HR',
    items: [
      {
        label: 'Attendance',
        href: '/hr/attendance',
        icon: 'CalendarCheck',
        permission: 'hr:attendance:read',
        moduleId: 'hr',
      },
      {
        label: 'Leave Management',
        href: '/hr/leave',
        icon: 'CalendarOff',
        permission: 'hr:leave:read',
        moduleId: 'hr',
      },
      {
        label: 'Payroll',
        href: '/hr/payroll',
        icon: 'Wallet',
        permission: 'hr:payroll:read',
        moduleId: 'hr',
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        label: 'Invoices',
        href: '/finance/invoices',
        icon: 'Receipt',
        permission: 'finance:invoices:read',
        moduleId: 'finance',
      },
      {
        label: 'Expenses',
        href: '/finance/expenses',
        icon: 'CreditCard',
        permission: 'finance:expenses:read',
        moduleId: 'finance',
      },
      {
        label: 'Payments',
        href: '/finance/payments',
        icon: 'Banknote',
        permission: 'finance:payments:read',
        moduleId: 'finance',
      },
    ],
  },
  {
    title: 'CMS',
    items: [
      {
        label: 'Pages',
        href: '/cms/pages',
        icon: 'FileText',
        permission: 'cms:pages:read',
        moduleId: 'cms',
      },
      {
        label: 'Blog',
        href: '/cms/blogs',
        icon: 'PenSquare',
        permission: 'cms:blogs:read',
        moduleId: 'cms',
      },
      {
        label: 'Media Library',
        href: '/cms/media',
        icon: 'Image',
        permission: 'cms:media:read',
        moduleId: 'cms',
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      {
        label: 'Business Analytics',
        href: '/reports/business',
        icon: 'BarChart3',
        permission: 'reports:business:read',
        moduleId: 'reports',
      },
      {
        label: 'Revenue Reports',
        href: '/reports/revenue',
        icon: 'TrendingUp',
        permission: 'reports:revenue:read',
        moduleId: 'reports',
      },
    ],
  },
];
