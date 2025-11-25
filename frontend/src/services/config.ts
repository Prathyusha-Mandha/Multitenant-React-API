import axios from 'axios';
import { STORAGE_KEYS } from './constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7198';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
  if (!token) {
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getFormHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
  if (!token) {
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
};