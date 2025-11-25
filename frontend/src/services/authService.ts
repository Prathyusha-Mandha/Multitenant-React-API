import { axiosInstance } from './config';
import { userService } from './apiServices';

interface LoginResponse {
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

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const authService = {
  login: async (credentials: { userId: string; password: string }): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('UserId', credentials.userId);
    formData.append('Password', credentials.password);
    
    const response = await axiosInstance.post('/api/Auth/login', formData);
    const data: LoginResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  },

  register: async (userData: any) => {
    const formData = new FormData();
    formData.append('UserName', userData.UserName);
    formData.append('Email', userData.Email);
    formData.append('Password', userData.Password);
    formData.append('ConfirmPassword', userData.ConfirmPassword);
    formData.append('Role', userData.Role.toString());
    if (userData.Department) {
      formData.append('Department', userData.Department.toString());
    }
    formData.append('CompanyName', userData.CompanyName);
    
    try {
      const response = await axiosInstance.post('/api/RegistrationRequest', formData);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        throw new Error(`Registration failed: ${JSON.stringify(errorData)}`);
      }
      throw new Error(`Registration failed: ${error.message}`);
    }
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const formData = new FormData();
    formData.append('Email', email);
    
    const response = await axiosInstance.post('/api/Auth/forgot-password', formData);
    const data: ForgotPasswordResponse = response.data;
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string; confirmPassword: string }): Promise<ResetPasswordResponse> => {
    const formData = new FormData();
    formData.append('Email', data.email);
    formData.append('Otp', data.otp);
    formData.append('NewPassword', data.newPassword);
    formData.append('ConfirmPassword', data.confirmPassword);
    
    const response = await axiosInstance.post('/api/Auth/reset-password', formData);
    const responseData: ResetPasswordResponse = response.data;
    
    if (!responseData.success) {
      throw new Error(responseData.message);
    }
    
    return responseData;
  }
};