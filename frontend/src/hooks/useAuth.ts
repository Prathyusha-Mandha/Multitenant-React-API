import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../services/constants';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME);

    if (token && userId) {
      setUser({ userId, userRole, userName, token });
    }
  }, []);

  const login = async (credentials: { userId: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token || '');
      localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId || '');
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.role || '');
      localStorage.setItem(STORAGE_KEYS.USER_NAME, response.userName || '');
      
      setUser({
        userId: response.userId,
        userRole: response.role,
        userName: response.userName,
        token: response.token
      });

      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(userData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  };

  const getUserRole = () => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getUserRole,
    setError
  };
};