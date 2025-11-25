import { useState, useEffect } from 'react';
import { userService } from '../services';

export default function useProfile() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUserInfo(userData);
        setEditData(userData);
      } catch (error) {
        setErrors({ general: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file && file.type !== 'image/jpeg' && !file.name.toLowerCase().endsWith('.jpg')) {
      setErrors({ photo: 'Only image files in .jpg format are allowed' });
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }
    setSelectedFile(file);
    setErrors({});
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;
    
    setUpdating(true);
    try {
      const updateData = {
        UserName: userInfo.userName,
        Email: userInfo.email,
        ProfilePicture: selectedFile
      };
      
      const updatedUser = await userService.updateProfile(updateData);
      setUserInfo(updatedUser);
      setSelectedFile(null);
      setPreviewUrl('');
      setErrors({});
    } catch (error: any) {
      setErrors({ photo: error.message || 'Failed to upload photo' });
    } finally {
      setUpdating(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({ ...userInfo });
  };

  const handleSaveEdit = async () => {
    setUpdating(true);
    try {
      const updateData = {
        UserName: editData.userName,
        Email: editData.email,
        ProfilePicture: selectedFile || undefined
      };
      
      const updatedUser = await userService.updateProfile(updateData);
      setUserInfo(updatedUser);
      setIsEditing(false);
      setErrors({});
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...userInfo });
    setErrors({});
  };

  const handleEditDataChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleErrorClear = () => {
    setErrors({});
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
    handleEditClick,
    handleSaveEdit,
    handleCancelEdit,
    handleEditDataChange,
    handleErrorClear
  };
}