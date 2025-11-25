import { axiosInstance, getFormHeaders } from './config';

export const fileService = {
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

  uploadProfilePicture: async (file: File) => {
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('ProfilePicture', file);
    
    try {
      const response = await axiosInstance.put(`/api/User/${userId}`, formData, {
        headers: getFormHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to upload profile picture: ${error.response?.status} - ${error.response?.data}`);
    }
  },

  getProfilePicture: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/api/User/${userId}/profile-picture`, {
        headers: getFormHeaders(),
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getProfilePictureUrl: (profilePictureData: any) => {
    try {
      if (!profilePictureData) {
        return null;
      }
      
      if (typeof profilePictureData === 'string') {
        if (profilePictureData.startsWith('data:')) {
          return profilePictureData;
        }
        return `data:image/jpeg;base64,${profilePictureData}`;
      }
      
      if (Array.isArray(profilePictureData) && profilePictureData.length > 0) {
        const base64String = btoa(String.fromCharCode(...profilePictureData));
        return `data:image/jpeg;base64,${base64String}`;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
};