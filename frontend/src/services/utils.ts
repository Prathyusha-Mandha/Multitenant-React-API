import { STORAGE_KEYS } from './constants';

export const validateEmail = (email: string): string => {
  if (!email) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email format';
  }
  if (!email.endsWith('@gmail.com')) {
    return 'Email must end with @gmail.com';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length <= 8) {
    return 'Password must be more than 8 characters';
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
    return 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol';
  }
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) {
    return 'Confirm password is required';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

export const validateRequired = (value: string, fieldName: string): string => {
  if (!value?.trim()) {
    return `${fieldName} is required`;
  }
  return '';
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
};

export const getUserId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

export const getTenantId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TENANT_ID);
};

export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const getUserRoleFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role || null;
};

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded?.sub || null;
};

export const getTenantIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.TenantId || null;
};