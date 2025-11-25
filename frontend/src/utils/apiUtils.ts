import { STORAGE_KEYS } from '../services/constants';

export const getStoredUserId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID) || localStorage.getItem('userId');
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
};

export const getStoredUserRole = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
};

export const getStoredUserName = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_NAME);
};

export const clearStorage = (): void => {
  localStorage.clear();
};

export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
  }
  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
  }
  return error.message || 'An unexpected error occurred';
};

export const createFormDataFromObject = (obj: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};