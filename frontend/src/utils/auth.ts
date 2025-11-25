import { STORAGE_KEYS } from '../services/constants';

export const getUserId = (): string => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID) || '';
};

export const getToken = (): string => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || '';
};

export const getUserRole = (): string => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || '';
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};