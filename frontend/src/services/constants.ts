export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  POSTS: '/posts',
  NOTIFICATIONS: '/notifications',
  TENANTS: '/tenants',
  DEPARTMENTS: '/departments',
  CHATS: '/chats',
} as const;

export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  DEPT_MANAGER: 'DeptManager',
  EMPLOYEE: 'Employee',
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Dashboard',
  VERSION: '1.0.0',
  SIDEBAR_WIDTH: 280,
} as const;

export const MENU_ITEMS = {
  PROFILE: { key: 'Profile', label: 'Profile' },
  TENANT_DETAILS: { key: 'TenantDetails', label: 'Tenants' },
  REQUESTS: { key: 'Requests', label: 'Requests' },
  NOTIFICATIONS: { key: 'Notifications', label: 'Notifications' },
  USER_DETAILS: { key: 'UserDetails', label: 'Users' },
  CHATS: { key: 'Chats', label: 'Chats' },
  POSTS: { key: 'Posts', label: 'Posts' },
} as const;

export const ROLE_MENUS = {
  [USER_ROLES.ADMIN]: [
    MENU_ITEMS.PROFILE,
    MENU_ITEMS.TENANT_DETAILS,
    MENU_ITEMS.REQUESTS,
    MENU_ITEMS.NOTIFICATIONS,
  ],
  [USER_ROLES.MANAGER]: [
    MENU_ITEMS.PROFILE,
    MENU_ITEMS.REQUESTS,
    MENU_ITEMS.USER_DETAILS,
    MENU_ITEMS.NOTIFICATIONS,
    MENU_ITEMS.CHATS,
    MENU_ITEMS.POSTS,
  ],
  [USER_ROLES.DEPT_MANAGER]: [
    MENU_ITEMS.PROFILE,
    MENU_ITEMS.USER_DETAILS,
    MENU_ITEMS.POSTS,
    MENU_ITEMS.NOTIFICATIONS,
  ],
  [USER_ROLES.EMPLOYEE]: [
    MENU_ITEMS.PROFILE,
    MENU_ITEMS.USER_DETAILS,
    MENU_ITEMS.CHATS,
    MENU_ITEMS.POSTS,
    MENU_ITEMS.NOTIFICATIONS,
  ],
} as const;

export const UI_TEXT = {
  LOADING: 'Loading...',
  LOGOUT: 'Logout',
  DASHBOARD: 'Dashboard',
  BACK_TO_TENANTS: 'Back to Tenants',
  SELECT_TENANT: 'Select a Tenant',
  LOADING_TENANTS: 'Loading tenants...',
  LOADING_NOTIFICATIONS: 'Loading notifications...',
  DELETE_ALL_CONFIRM: 'Are you sure you want to delete all notifications?',
  DELETE_SUCCESS: 'All notifications deleted successfully!',
  DELETE_ERROR: 'Failed to delete notifications: ',
  ERROR_OCCURRED: 'An error occurred',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ROLE: 'userRole',
  USER_NAME: 'userName',
  CURRENT_VIEW: 'currentView',
  USER_ID: 'userId',
  TENANT_ID: 'tenantId',
} as const;