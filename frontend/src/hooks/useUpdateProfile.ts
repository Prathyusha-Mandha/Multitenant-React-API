import { useState, useEffect } from 'react';

export default function useUpdateProfile() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    department: '',
    profilePicture: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockProfile = {
          userName: 'John Doe',
          email: 'john@example.com',
          department: 'IT',
          profilePicture: ''
        };
        setFormData(mockProfile);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, profilePicture: url }));
    } else {
      setPreviewUrl('');
      setFormData(prev => ({ ...prev, profilePicture: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return {
    formData,
    previewUrl,
    loading,
    updating,
    handleFileChange,
    handleInputChange,
    handleSubmit
  };
}