/**
 * Central permission registry.
 *
 * Permission format: `module:resource:action`
 * Wildcard `*` grants access to all within that segment.
 *
 * This file is the single source of truth for permission strings.
 * Referenced by navigation config, middleware, API guards, and the PermissionGate component.
 */

/** All available permission actions. */
export const ACTIONS = ['read', 'create', 'update', 'delete'] as const;
export type PermissionAction = (typeof ACTIONS)[number];

/** Full wildcard — grants unrestricted access. */
export const SUPER_ADMIN_PERMISSION = '*:*:*';

/**
 * Permission definitions grouped by module.
 * Each module contains resources, each resource supports CRUD actions.
 */
export const PERMISSIONS = {
  dashboard: {
    stats: ['read'],
  },
  core: {
    users: ['read', 'create', 'update', 'delete'],
    roles: ['read', 'create', 'update', 'delete'],
    employees: ['read', 'create', 'update', 'delete'],
    departments: ['read', 'create', 'update', 'delete'],
    branches: ['read', 'create', 'update', 'delete'],
    settings: ['read', 'update'],
    notifications: ['read', 'update'],
    'activity-logs': ['read'],
    files: ['read', 'create', 'delete'],
  },
  crm: {
    leads: ['read', 'create', 'update', 'delete'],
    customers: ['read', 'create', 'update', 'delete'],
    contacts: ['read', 'create', 'update', 'delete'],
    pipeline: ['read', 'create', 'update', 'delete'],
    opportunities: ['read', 'create', 'update', 'delete'],
    quotations: ['read', 'create', 'update', 'delete'],
    'follow-ups': ['read', 'create', 'update', 'delete'],
  },
  projects: {
    projects: ['read', 'create', 'update', 'delete'],
    milestones: ['read', 'create', 'update', 'delete'],
    tasks: ['read', 'create', 'update', 'delete'],
    sprints: ['read', 'create', 'update', 'delete'],
    'time-tracking': ['read', 'create', 'update', 'delete'],
    reports: ['read'],
  },
  products: {
    products: ['read', 'create', 'update', 'delete'],
    categories: ['read', 'create', 'update', 'delete'],
    versions: ['read', 'create', 'update', 'delete'],
    licensing: ['read', 'create', 'update', 'delete'],
    releases: ['read', 'create', 'update', 'delete'],
  },
  services: {
    services: ['read', 'create', 'update', 'delete'],
    tickets: ['read', 'create', 'update', 'delete'],
    sla: ['read', 'create', 'update', 'delete'],
    'knowledge-base': ['read', 'create', 'update', 'delete'],
  },
  hr: {
    attendance: ['read', 'create', 'update'],
    leave: ['read', 'create', 'update', 'delete'],
    payroll: ['read', 'create', 'update'],
    holidays: ['read', 'create', 'update', 'delete'],
    performance: ['read', 'create', 'update'],
  },
  finance: {
    invoices: ['read', 'create', 'update', 'delete'],
    expenses: ['read', 'create', 'update', 'delete'],
    payments: ['read', 'create', 'update'],
    revenue: ['read'],
    reports: ['read'],
  },
  cms: {
    pages: ['read', 'create', 'update', 'delete'],
    blogs: ['read', 'create', 'update', 'delete'],
    media: ['read', 'create', 'delete'],
    faqs: ['read', 'create', 'update', 'delete'],
    testimonials: ['read', 'create', 'update', 'delete'],
    careers: ['read', 'create', 'update', 'delete'],
    messages: ['read', 'delete'],
  },
  reports: {
    business: ['read'],
    revenue: ['read'],
    employees: ['read'],
    projects: ['read'],
    clients: ['read'],
  },
} as const;

/**
 * Flattens the permissions object into an array of permission strings.
 * Example output: ['dashboard:stats:read', 'core:users:read', ...]
 */
export function getAllPermissions(): string[] {
  const result: string[] = [];
  for (const [module, resources] of Object.entries(PERMISSIONS)) {
    for (const [resource, actions] of Object.entries(resources)) {
      for (const action of actions) {
        result.push(`${module}:${resource}:${action}`);
      }
    }
  }
  return result;
}

/**
 * Generates all permissions for a given module.
 * Example: getModulePermissions('core') → ['core:users:read', 'core:users:create', ...]
 */
export function getModulePermissions(module: keyof typeof PERMISSIONS): string[] {
  const resources = PERMISSIONS[module];
  const result: string[] = [];
  for (const [resource, actions] of Object.entries(resources)) {
    for (const action of actions) {
      result.push(`${module}:${resource}:${action}`);
    }
  }
  return result;
}

/**
 * Checks whether a user's permissions include the required permission.
 * Supports wildcard matching at each segment level.
 *
 * @param userPermissions - Array of permission strings assigned to the user
 * @param required - The permission string to check
 * @returns true if the user has the required permission
 */
export function hasPermission(userPermissions: string[], required: string): boolean {
  if (userPermissions.includes(SUPER_ADMIN_PERMISSION)) return true;
  if (userPermissions.includes(required)) return true;

  const [reqModule, reqResource, reqAction] = required.split(':');

  return userPermissions.some((perm) => {
    const [module, resource, action] = perm.split(':');

    // Wildcard at module level: *:*:*
    if (module === '*') return true;

    // Module match, wildcard at resource level: core:*:*
    if (module === reqModule && resource === '*') return true;

    // Module + resource match, wildcard at action level: core:users:*
    if (module === reqModule && resource === reqResource && action === '*') return true;

    return false;
  });
}

/**
 * Default role definitions with their permission sets.
 */
export const DEFAULT_ROLES = [
  {
    name: 'super-admin',
    description: 'Full system access with no restrictions',
    permissions: [SUPER_ADMIN_PERMISSION],
    isSystem: true,
  },
  {
    name: 'admin',
    description: 'Company administration — all modules except system settings',
    permissions: [
      ...getModulePermissions('dashboard'),
      ...getModulePermissions('core'),
      ...getModulePermissions('crm'),
      ...getModulePermissions('projects'),
      ...getModulePermissions('products'),
      ...getModulePermissions('services'),
      ...getModulePermissions('hr'),
      ...getModulePermissions('finance'),
      ...getModulePermissions('cms'),
      ...getModulePermissions('reports'),
    ],
    isSystem: true,
  },
  {
    name: 'manager',
    description: 'Department-level access — read/write for assigned modules',
    permissions: [
      'dashboard:stats:read',
      'core:employees:read',
      'core:departments:read',
      'core:branches:read',
      'core:notifications:read',
      'core:notifications:update',
      'core:files:read',
      'core:files:create',
      ...getModulePermissions('projects'),
      ...getModulePermissions('crm'),
      'reports:projects:read',
      'reports:clients:read',
    ],
    isSystem: true,
  },
  {
    name: 'employee',
    description: 'Self-service access — own profile, assigned tasks and time tracking',
    permissions: [
      'dashboard:stats:read',
      'core:employees:read',
      'core:notifications:read',
      'core:notifications:update',
      'core:files:read',
      'core:files:create',
      'projects:tasks:read',
      'projects:tasks:update',
      'projects:time-tracking:read',
      'projects:time-tracking:create',
      'hr:attendance:read',
      'hr:attendance:create',
      'hr:leave:read',
      'hr:leave:create',
    ],
    isSystem: true,
  },
  {
    name: 'viewer',
    description: 'Read-only access across all modules',
    permissions: getAllPermissions().filter((p) => p.endsWith(':read')),
    isSystem: true,
  },
] as const;
