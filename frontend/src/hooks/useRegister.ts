import { useState, useEffect } from 'react';

export default function useRegister() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    tenantId: '',
    departmentName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');



  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      setSuccessMessage('Registration successful! Please wait for approval.');
      setFormData({
        userName: '',
        email: '',
        password: '',
        tenantId: '',
        departmentName: ''
      });
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    availableDepartments,
    formData,
    loading,
    errors,
    successMessage,
    handleInputChange,
    handleSubmit
  };
}