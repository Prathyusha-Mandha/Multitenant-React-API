import { useState, useEffect } from 'react';
import { authService } from './authService';
import { adminService, userService, postService } from './apiServices';
import { fileService } from './fileService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (credentials: { userId: string; password: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(credentials);
      
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('userRole', response.role || '');
      localStorage.setItem('userId', response.userId || '');
      localStorage.setItem('tenantId', response.tenantId || '');
      
      return response;
    } catch (err) {
      setError('Invalid credentials. Please check your User ID and password.');
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
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('tenantId');
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    setError
  };
};

// Form Validation Hook
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: { [K in keyof T]?: (value: T[K]) => string }
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    Object.keys(validationRules).forEach(key => {
      const rule = validationRules[key as keyof T];
      if (rule) {
        const error = rule(values[key as keyof T]);
        if (error) {
          newErrors[key as keyof T] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    reset,
    setErrors
  };
};

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState<{[key: string]: string}>({});
  const [replyFiles, setReplyFiles] = useState<{[key: string]: File | null}>({});
  const [replyFileErrors, setReplyFileErrors] = useState<{[key: string]: string}>({});

  const fetchPosts = async () => {
    try {
      const data = await postService.getPostMessages();
      setPosts(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (postMessageId: string) => {
    const replyText = newReply[postMessageId];
    if (!replyText?.trim()) return;
    
    try {
      const replyData = {
        replyText: replyText,
        file: replyFiles[postMessageId] || undefined
      };
      
      await postService.createResponseMessage(postMessageId, replyData);
      setNewReply(prev => ({ ...prev, [postMessageId]: '' }));
      setReplyFiles(prev => ({ ...prev, [postMessageId]: null }));
      
      await fetchPosts();
    } catch (error) {
    }
  };

  const handleFileChange = (postMessageId: string, file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      setReplyFileErrors(prev => ({ ...prev, [postMessageId]: 'Please select a PDF file only' }));
      setReplyFiles(prev => ({ ...prev, [postMessageId]: null }));
    } else {
      setReplyFileErrors(prev => ({ ...prev, [postMessageId]: '' }));
      setReplyFiles(prev => ({ ...prev, [postMessageId]: file }));
    }
  };

  const downloadFile = async (responseMessageId: string, fileName: string) => {
    try {
      const blob = await postService.downloadResponseFile(responseMessageId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || `response_${responseMessageId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    newReply,
    setNewReply,
    replyFiles,
    replyFileErrors,
    fetchPosts,
    createReply,
    handleFileChange,
    downloadFile
  };
};

export const useRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await adminService.getRegistrationRequests();
        setRequests(data || []);
        setFilteredRequests(data || []);
      } catch (error: any) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (registrationId: string, status: string) => {
    setUpdating(true);
    
    const updateLocalStatus = (requestsList: any[]) => 
      requestsList.map(req => 
        (req.registrationId === registrationId || req.id === registrationId)
          ? { ...req, status: status }
          : req
      );
    
    setRequests(prev => updateLocalStatus(prev));
    setFilteredRequests(prev => updateLocalStatus(prev));
    
    try {
      await adminService.updateRegistrationStatus(registrationId, status);
    } catch (error: any) {
      const revertStatus = (requestsList: any[]) => 
        requestsList.map(req => 
          (req.registrationId === registrationId || req.id === registrationId)
            ? { ...req, status: 'Pending' }
            : req
        );
      
      setRequests(prev => revertStatus(prev));
      setFilteredRequests(prev => revertStatus(prev));
      
      const errorMessage = error?.message || 'An error occurred';
      alert(`Failed to ${status.toLowerCase()} request: ${errorMessage}`);
    } finally {
      setUpdating(false);
    }
  };

  return {
    requests,
    filteredRequests,
    loading,
    updating,
    setFilteredRequests,
    handleStatusUpdate
  };
};

export const useProfile = () => {
  const [userInfo, setUserInfo] = useState({
    userId: '', userName: '', email: '', role: '', tenantId: '', tenantName: '', departmentName: '', profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ userName: '', email: '' });
  const [errors, setErrors] = useState({ userName: '', email: '', file: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await userService.getCurrentUser();
        let profilePic = '';
        if (userData.profilePicture) {
          try {
            profilePic = fileService.getProfilePictureUrl(userData.profilePicture) || '';
          } catch (error) {
            profilePic = '';
          }
        }
        
        setUserInfo({
          userId: userData.userId || 'N/A',
          userName: userData.userName || 'N/A',
          email: userData.email || 'N/A',
          role: userData.role || 'N/A',
          tenantId: userData.tenantId || localStorage.getItem('tenantId') || 'N/A',
          tenantName: userData.tenantName || localStorage.getItem('tenantName') || userData.companyName || 'N/A',
          departmentName: userData.departmentName || 'N/A',
          profilePicture: profilePic
        });
      } catch (error) {
        setUserInfo({
          userId: localStorage.getItem('userId') || 'N/A',
          userName: localStorage.getItem('userName') || 'Administrator',
          email: localStorage.getItem('userEmail') || 'admin@gmail.com',
          role: localStorage.getItem('userRole') || 'Admin',
          tenantId: localStorage.getItem('tenantId') || 'N/A',
          tenantName: localStorage.getItem('tenantName') || localStorage.getItem('companyName') || 'N/A',
          departmentName: 'N/A',
          profilePicture: ''
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg') {
        setErrors(prev => ({ ...prev, file: 'Please select a JPG image file only' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }
      
      setErrors(prev => ({ ...prev, file: '' }));
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      alert('Please select a photo first');
      return;
    }
    
    setUpdating(true);
    try {
      const result = await userService.updateProfile({ UserName: userInfo.userName, Email: userInfo.email, ProfilePicture: selectedFile });
      
      let newProfilePic = '';
      if (result.profilePicture) {
        try {
          newProfilePic = fileService.getProfilePictureUrl(result.profilePicture) || '';
        } catch (error) {
        }
      }
      setUserInfo(prev => ({ ...prev, profilePicture: newProfilePic }));
      setSelectedFile(null);
      setPreviewUrl('');
      alert('Profile picture updated successfully!');
    } catch (error: any) {
      alert(`Error uploading photo: ${error?.message || 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  return {
    userInfo,
    loading,
    updating,
    selectedFile,
    previewUrl,
    isEditing,
    editData,
    errors,
    handleFileChange,
    handlePhotoUpload,
    setIsEditing,
    setEditData,
    setErrors
  };
};