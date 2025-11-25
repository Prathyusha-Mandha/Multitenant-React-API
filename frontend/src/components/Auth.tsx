import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Person, Lock, AccountCircle, Key, Send, Security, CheckCircle } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { authService } from '../services';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
}

const FormField = ({ name, label, type = 'text', placeholder, value, onChange, required, error, icon }: FormFieldProps) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ position: 'relative' }}>
      {icon && (
        <Box sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
          {icon}
        </Box>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: icon ? '12px 12px 12px 48px' : '12px',
          border: error ? '2px solid #f44336' : '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '16px',
          outline: 'none',
          transition: 'border-color 0.3s',
        }}
      />
    </Box>
    {error && (
      <Typography variant="body2" sx={{ color: 'error.main', mt: 0.5, fontSize: '0.875rem' }}>
        {error}
      </Typography>
    )}
  </Box>
);

const GradientButton = ({ children, ...props }: any) => (
  <button
    {...props}
    style={{
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.7 : 1,
      marginBottom: '16px',
      transition: 'all 0.3s',
    }}
  >
    {children}
  </button>
);

interface AuthHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ icon, title, subtitle }: AuthHeaderProps) => (
  <Box sx={{ textAlign: 'center', mb: 4 }}>
    <Box sx={{
      display: 'inline-flex',
      p: 2,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      mb: 2,
      animation: 'pulse 2s infinite'
    }}>
      {icon}
    </Box>
    <Typography variant="h4" component="h2" sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
      mb: 1,
      fontSize: { xs: '1.5rem', sm: '2.125rem' }
    }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {subtitle}
    </Typography>
  </Box>
);

interface WelcomePanelProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export const WelcomePanel = ({ title, subtitle, backgroundImage }: WelcomePanelProps) => (
  <>
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("${backgroundImage}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.7
    }} />
    
    <Box className="particles">
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          className="particle"
          sx={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 4 + 4}s`
          }}
        />
      ))}
    </Box>
    
    <Box sx={{ 
      textAlign: 'center', 
      zIndex: 1, 
      color: 'white', 
      px: 4,
      py: 3,
      animation: 'slideInLeft 1s ease-out',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 3,
      backdropFilter: 'blur(10px)'
    }}>
      <Typography variant="h3" sx={{ 
        fontWeight: 'bold', 
        mb: 2,
        textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
        color: '#ffffff'
      }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ 
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        color: '#f0f0f0',
        fontWeight: 500
      }}>
        {subtitle}
      </Typography>
    </Box>
  </>
);

interface LoginFormProps {
  onLoginSuccess: (role: string) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ userId: '', password: '', login: '' });

  const validateForm = () => {
    const newErrors = { userId: '', password: '', login: '' };
    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return !newErrors.userId && !newErrors.password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '', login: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await authService.login({
        userId: formData.userId.trim(),
        password: formData.password
      });
      
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('userRole', response.role || '');
      localStorage.setItem('userId', response.userId || '');
      localStorage.setItem('tenantId', response.tenantId || '');
      
      onLoginSuccess(response.role || '');
    } catch (error) {
      setErrors(prev => ({ ...prev, login: 'Invalid credentials. Please check your User ID and password.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {errors.login && (
        <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 500, mb: 2, textAlign: 'center' }}>
          {errors.login}
        </Typography>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <FormField
          name="userId"
          label="User ID"
          value={formData.userId}
          onChange={handleInputChange}
          required
          error={errors.userId}
          icon={<Person sx={{ color: 'primary.main' }} />}
        />
        
        <FormField
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          error={errors.password}
          icon={<Lock sx={{ color: 'primary.main' }} />}
        />
        
        <GradientButton type="submit" disabled={loading}>
          <AccountCircle style={{ marginRight: '8px' }} />
          {loading ? 'Signing In...' : 'Sign In'}
        </GradientButton>
      </Box>
    </>
  );
};

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  onBack: () => void;
}

export const EmailStep = ({ email, onEmailChange, onSubmit, loading, error, onBack }: EmailStepProps) => (
  <>
    <AuthHeader
      icon={<Key sx={{ fontSize: 40, color: 'white' }} />}
      title="Forgot Password"
      subtitle="Enter your email to reset password"
    />
    
    <Box component="form" onSubmit={onSubmit}>
      <FormField
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        error={error}
      />
      
      <GradientButton type="submit" disabled={loading}>
        <Send style={{ marginRight: '8px' }} />
        {loading ? 'Sending...' : 'Send OTP'}
      </GradientButton>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Remember your password?{' '}
          <Typography
            component="button"
            type="button"
            onClick={onBack}
            sx={{ 
              textDecoration: 'none', 
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              border: 'none',
              backgroundColor: 'transparent'
            }}
          >
            Sign In
          </Typography>
        </Typography>
      </Box>
    </Box>
  </>
);

interface ResetStepProps {
  otp: string;
  newPassword: string;
  confirmPassword: string;
  onOtpChange: (otp: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errors: { otp: string; newPassword: string; confirmPassword: string };
}

export const ResetStep = ({ 
  otp, 
  newPassword, 
  confirmPassword, 
  onOtpChange, 
  onNewPasswordChange, 
  onConfirmPasswordChange, 
  onSubmit, 
  loading, 
  errors 
}: ResetStepProps) => (
  <>
    <AuthHeader
      icon={<Security sx={{ fontSize: 40, color: 'white' }} />}
      title="Reset Password"
      subtitle="Enter OTP and new password"
    />
    
    <Box component="form" onSubmit={onSubmit}>
      <FormField
        name="otp"
        label="OTP Code"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => onOtpChange(e.target.value)}
        required
        error={errors.otp}
      />
      
      <FormField
        name="newPassword"
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
        required
        error={errors.newPassword}
      />
      
      <FormField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        required
        error={errors.confirmPassword}
      />
      
      <GradientButton type="submit" disabled={loading}>
        <CheckCircle style={{ marginRight: '8px' }} />
        {loading ? 'Resetting...' : 'Reset Password'}
      </GradientButton>
    </Box>
  </>
);