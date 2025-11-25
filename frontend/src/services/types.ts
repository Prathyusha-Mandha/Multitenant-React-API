export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
}

export interface Notification {
  notificationId?: string;
  notificationMessage: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  userId?: string;
  userName?: string;
  email?: string;
  role?: string;
  tenantId?: string;
  tenantName?: string;
}

export interface ConversationType {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface Department {
  id: number;
  name: string;
  employeeCount: number;
  deptManagers: number;
  employees: number;
  managerName: string;
}

export interface Tenant {
  id: number;
  name: string;
  manager: string;
  departments: Department[];
}

export interface DashboardProps {
  userRole: string;
}

export interface NavbarProps {
  currentView: 'login' | 'register' | 'forgot-password';
  onViewChange: (view: 'login' | 'register' | 'forgot-password') => void;
}

export interface SidebarProps {
  userRole: string;
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}