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
        href: '/admin',
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
        href: '/admin/users',
        icon: 'Users',
        permission: 'core:users:read',
        moduleId: 'core',
      },
      {
        label: 'Roles & Permissions',
        href: '/admin/roles',
        icon: 'Shield',
        permission: 'core:roles:read',
        moduleId: 'core',
      },
      {
        label: 'Employees',
        href: '/admin/employees',
        icon: 'UserCheck',
        permission: 'core:employees:read',
        moduleId: 'core',
      },
      {
        label: 'Departments',
        href: '/admin/departments',
        icon: 'Building2',
        permission: 'core:departments:read',
        moduleId: 'core',
      },
      {
        label: 'Branches',
        href: '/admin/branches',
        icon: 'MapPin',
        permission: 'core:branches:read',
        moduleId: 'core',
      },
      {
        label: 'Company Settings',
        href: '/admin/settings/company',
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
        href: '/admin/notifications',
        icon: 'Bell',
        moduleId: 'core',
      },
      {
        label: 'Activity Logs',
        href: '/admin/activity-logs',
        icon: 'ScrollText',
        permission: 'core:activity-logs:read',
        moduleId: 'core',
      },
      {
        label: 'File Manager',
        href: '/admin/files',
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
        href: '/admin/crm/leads',
        icon: 'UserPlus',
        permission: 'crm:leads:read',
        moduleId: 'crm',
      },
      {
        label: 'Customers',
        href: '/admin/crm/customers',
        icon: 'Building',
        permission: 'crm:customers:read',
        moduleId: 'crm',
      },
      {
        label: 'Contacts',
        href: '/admin/crm/contacts',
        icon: 'Contact',
        permission: 'crm:contacts:read',
        moduleId: 'crm',
      },
      {
        label: 'Sales Pipeline',
        href: '/admin/crm/pipeline',
        icon: 'GitBranchPlus',
        permission: 'crm:pipeline:read',
        moduleId: 'crm',
      },
      {
        label: 'Quotations',
        href: '/admin/crm/quotations',
        icon: 'FileSpreadsheet',
        permission: 'crm:quotations:read',
        moduleId: 'crm',
      },
    ],
  },
  {
    title: 'Project Management',
    items: [
      {
        label: 'All Projects',
        href: '/admin/projects',
        icon: 'FolderKanban',
        permission: 'projects:read',
        moduleId: 'projects',
      },
      {
        label: 'Tasks',
        href: '/admin/projects/tasks',
        icon: 'CheckSquare',
        permission: 'tasks:read',
        moduleId: 'projects',
      },
    ],
  },
  {
    title: 'Product & Inventory',
    items: [
      {
        label: 'Products Catalog',
        href: '/admin/products',
        icon: 'PackageSearch',
        permission: 'products:read',
        moduleId: 'products',
      },
      {
        label: 'Categories',
        href: '/admin/products/categories',
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
        href: '/admin/services/tickets',
        icon: 'Ticket',
        permission: 'services:tickets:read',
        moduleId: 'services',
      },
      {
        label: 'Knowledge Base',
        href: '/admin/services/knowledge-base',
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
        href: '/admin/hr/attendance',
        icon: 'CalendarCheck',
        permission: 'hr:attendance:read',
        moduleId: 'hr',
      },
      {
        label: 'Leave Management',
        href: '/admin/hr/leave',
        icon: 'CalendarOff',
        permission: 'hr:leave:read',
        moduleId: 'hr',
      },
      {
        label: 'Payroll',
        href: '/admin/hr/payroll',
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
        href: '/admin/finance',
        icon: 'Receipt',
        permission: 'finance:invoices:read',
        moduleId: 'finance',
      },
      {
        label: 'Expenses',
        href: '/admin/finance/expenses',
        icon: 'CreditCard',
        permission: 'finance:expenses:read',
        moduleId: 'finance',
      },
      {
        label: 'Payments',
        href: '/admin/finance/payments',
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
        label: 'Blogs',
        href: '/admin/cms/blogs',
        icon: 'PenTool',
        permission: 'cms:blogs:read',
        moduleId: 'cms',
      },
      {
        label: 'FAQs',
        href: '/admin/cms/faqs',
        icon: 'HelpCircle',
        permission: 'cms:faqs:read',
        moduleId: 'cms',
      },
      {
        label: 'Testimonials',
        href: '/admin/cms/testimonials',
        icon: 'Star',
        permission: 'cms:testimonials:read',
        moduleId: 'cms',
      },
      {
        label: 'Contact Messages',
        href: '/admin/cms/contacts',
        icon: 'Inbox',
        permission: 'cms:contacts:read',
        moduleId: 'cms',
      },
    ],
  },

  {
    title: 'Reports',
    items: [
      {
        label: 'Business Analytics',
        href: '/admin/reports/business',
        icon: 'BarChart3',
        permission: 'reports:business:read',
        moduleId: 'reports',
      },
      {
        label: 'Revenue Reports',
        href: '/admin/reports/revenue',
        icon: 'TrendingUp',
        permission: 'reports:revenue:read',
        moduleId: 'reports',
      },
    ],
  },
];
