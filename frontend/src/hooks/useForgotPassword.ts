import { useState } from 'react';
import { authService } from '../services';

export default function useForgotPassword(onBack: () => void) {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSendOTP = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      await authService.forgotPassword(email);
      setStep('reset');
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setErrors({});
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }
    
    try {
      await authService.resetPassword({ email, otp, newPassword, confirmPassword });
      setStep('success');
    } catch (error: any) {
      
      const errorMessage = error.message?.toLowerCase() || '';
      const errorData = error.response?.data?.toLowerCase() || '';
      
      if (errorMessage.includes('otp') ||
          errorMessage.includes('invalid or expired') ||
          errorData.includes('otp') ||
          errorData.includes('invalid or expired')) {
        setErrors({ otp: 'Invalid or expired OTP' });
      } else if (errorMessage.includes('password') ||
                 errorData.includes('password')) {
        setErrors({ general: 'Password validation failed' });
      } else {
        setErrors({ general: error.message || 'Failed to reset password' });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    loading,
    errors,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    handleSendOTP,
    handleResetPassword
  };
}