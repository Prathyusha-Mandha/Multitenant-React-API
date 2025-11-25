import { axiosInstance, getAuthHeaders, getFormHeaders } from './config';

class BaseApiService {
  protected async makeRequest(method: string, url: string, data?: any, headers?: any) {
    try {
      const config = {
        method,
        url,
        headers: headers || getAuthHeaders(),
        ...(data && (method === 'POST' || method === 'PUT' || method === 'PATCH') && { data })
      };
      
      const response = await axiosInstance(config);
      return response.data;
    } catch (error: any) {
     
      throw this.handleError(error);
    }
  }

  protected handleError(error: any) {
    if (error.response?.status === 401) return new Error('Unauthorized');
    if (error.response?.status === 403) return new Error('Forbidden');
    if (error.response?.status === 404) return new Error('Not Found');
    return new Error(error.response?.data?.message || error.message || 'Request failed');
  }

  protected createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  }
}

class UserService extends BaseApiService {
  async getUsers() {
    return this.makeRequest('GET', '/api/User');
  }

  async getCurrentUser() {
    const userId = localStorage.getItem('userId') || localStorage.getItem('USER_ID');
    if (!userId) throw new Error('User ID not found in storage');
    return this.makeRequest('GET', `/api/User/${userId}`);
  }

  async updateProfile(updateData: { UserName: string; Email: string; ProfilePicture?: File }) {
    const userId = localStorage.getItem('userId') || localStorage.getItem('USER_ID');
    if (!userId) throw new Error('User ID not found in storage');
    
    const formData = this.createFormData(updateData);
    return this.makeRequest('PUT', `/api/User/${userId}`, formData, getFormHeaders());
  }

  async getUsersByDepartment(departmentName: string) {
    return this.makeRequest('GET', `/api/User/department/${encodeURIComponent(departmentName)}`);
  }

  async sendForgotPasswordOTP(email: string) {
    const formData = new FormData();
    formData.append('Email', email);
    
    const response = await axiosInstance.post('/api/Auth/forgot-password', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || 'Email not found');
    }
    
    return data;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Otp', otp);
    formData.append('NewPassword', newPassword);
    
    try {
      const response = await axiosInstance.post('/api/Auth/reset-password', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}

export const userService = new UserService();

export const adminService = {
  getRegistrationRequests: async () => {
    try {
      const response = await axiosInstance.get('/api/RegistrationRequest', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) throw new Error('Unauthorized');
      if (error.response?.status === 403) throw new Error('Forbidden');
      throw new Error('Failed to fetch requests');
    }
  },

  getTenants: async () => {
    try {
      const response = await axiosInstance.get('/api/Tenant', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) throw new Error('Unauthorized');
      if (error.response?.status === 403) throw new Error('Forbidden');
      throw new Error('Failed to fetch tenants');
    }
  },

  updateRegistrationStatus: async (registrationId: string, status: string) => {
    try {
      const approverId = localStorage.getItem('userId') || localStorage.getItem('USER_ID');
      const token = localStorage.getItem('token') || localStorage.getItem('TOKEN');
      const statusEnum = status === 'Approved' || status === 'Accepted' ? 1 : status === 'Rejected' ? 2 : 0;
      
      const formData = new FormData();
      formData.append('Status', statusEnum.toString());
      
      const response = await axiosInstance.put(
        `/api/RegistrationRequest/${registrationId}/status?approverId=${approverId}`, 
        formData, 
        {
          headers: getFormHeaders()
        }
      );
      return response.data;
    } catch (error: any) {
      // Silently handle errors without throwing
      return null;
    }
  },

  getTenantNames: async () => {
    try {
      const response = await axiosInstance.get('/api/Tenant/names');
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  getTenantDepartmentsByName: async (tenantName: string) => {
    try {
      const response = await axiosInstance.get(`/api/Tenant/name/${encodeURIComponent(tenantName)}/departments`);
      return response.data || [];
    } catch (error) {
      return [];
    }
  }
};

// Post Service
export const postService = {
  getPostMessages: async () => {
    try {
      const response = await axiosInstance.get('/api/PostMessage', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      return [];
    }
  },

  getPostById: async (postMessageId: string) => {
    try {
      const response = await axiosInstance.get(`/api/PostMessage/${postMessageId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch post details');
    }
  },

  getResponseMessages: async (postMessageId: string) => {
    try {
      const response = await axiosInstance.get(`/api/ResponseMessage/post/${postMessageId}`, {
        headers: getAuthHeaders(),
      });
      console.log('Fetched responses for post:', postMessageId, response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching responses:', error);
      return [];
    }
  },

  createPostMessage: async (postData: { description: string; department?: string; file?: File }) => {
    const formData = new FormData();
    formData.append('Description', postData.description);
    formData.append('Department', postData.department || 'All');
    if (postData.file) {
      formData.append('FileUpload', postData.file);
    }
    
    try {
      const response = await axiosInstance.post('/api/PostMessage/form', formData, {
        headers: getFormHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create post');
    }
  },

  createResponseMessage: async (postMessageId: string, replyData: { replyText: string; file?: File }) => {
    const formData = new FormData();
    formData.append('PostMessageId', postMessageId);
    formData.append('ReplyText', replyData.replyText);
    if (replyData.file) {
      formData.append('FileUpload', replyData.file);
      console.log('File attached to reply:', replyData.file.name, replyData.file.type);
    }
    
    console.log('Creating response with data:', {
      postMessageId,
      replyText: replyData.replyText,
      hasFile: !!replyData.file
    });
    
    try {
      const response = await axiosInstance.post('/api/ResponseMessage/form', formData, {
        headers: getFormHeaders(),
      });
      console.log('Response created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating response:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create response');
    }
  },

  downloadResponseFile: async (responseMessageId: string) => {
    try {
      const response = await axiosInstance.get(`/api/ResponseMessage/${responseMessageId}/download`, {
        headers: getFormHeaders(),
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to download file');
    }
  },

  downloadPostFile: async (postMessageId: string) => {
    try {
      const response = await axiosInstance.get(`/api/PostMessage/${postMessageId}/download`, {
        headers: getFormHeaders(),
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to download post file');
    }
  }
};


export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await axiosInstance.get('/api/Notification', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) throw new Error('Unauthorized');
      if (error.response?.status === 403) throw new Error('Forbidden');
      throw new Error('Failed to fetch notifications');
    }
  },

  deleteAllNotifications: async () => {
    try {
      const userId = localStorage.getItem('userId') || localStorage.getItem('USER_ID');
      const response = await axiosInstance.delete(`/api/Notification?userId=${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data || { success: true };
    } catch (error: any) {
      if (error.response?.status === 401) throw new Error('Unauthorized');
      if (error.response?.status === 403) throw new Error('Forbidden');
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete notifications');
    }
  }
};