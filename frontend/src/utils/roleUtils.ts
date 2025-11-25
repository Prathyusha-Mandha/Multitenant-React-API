export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  DEPARTMENT_MANAGER: 'DepartmentManager',
  EMPLOYEE: 'Employee'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const getRoleColor = (role: string) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'error';
    case ROLES.MANAGER:
      return 'primary';
    case ROLES.DEPARTMENT_MANAGER:
      return 'secondary';
    case ROLES.EMPLOYEE:
      return 'success';
    default:
      return 'default';
  }
};

export const getRolePermissions = (role: string) => {
  switch (role) {
    case ROLES.ADMIN:
      return {
        canViewTenants: true,
        canManageRequests: true,
        canViewAllUsers: true,
        canManageNotifications: true,
        canChat: false,
        canPost: false,
      };
    case ROLES.MANAGER:
    case ROLES.DEPARTMENT_MANAGER:
      return {
        canViewTenants: false,
        canManageRequests: true,
        canViewAllUsers: true,
        canManageNotifications: true,
        canChat: true,
        canPost: true,
      };
    case ROLES.EMPLOYEE:
      return {
        canViewTenants: false,
        canManageRequests: false,
        canViewAllUsers: true,
        canManageNotifications: true,
        canChat: true,
        canPost: true,
      };
    default:
      return {
        canViewTenants: false,
        canManageRequests: false,
        canViewAllUsers: false,
        canManageNotifications: false,
        canChat: false,
        canPost: false,
      };
  }
};

export const hasPermission = (userRole: string, permission: keyof ReturnType<typeof getRolePermissions>) => {
  const permissions = getRolePermissions(userRole);
  return permissions[permission];
};