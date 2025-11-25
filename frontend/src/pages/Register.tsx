import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  IconButton,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { PersonAdd, Visibility, VisibilityOff, Business, Person } from '@mui/icons-material';
import { authService } from '../services/authService';
import { adminService } from '../services/apiServices';

const Register = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Role: '',
    Department: '',
    CompanyName: ''
  });
  const [tenants, setTenants] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const navigate = useNavigate();

  const steps = ['Personal Info', 'Organization', 'Account Setup'];

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const tenantNames = await adminService.getTenantNames();
        setTenants(tenantNames);
      } catch (error) {
      }
    };
    fetchTenants();
  }, []);

  useEffect(() => {
    if (formData.CompanyName) {
      const fetchDepartments = async () => {
        try {
          if (formData.Role === 'DeptManager') {
            const allDepts: string[] = [];
            for (const tenant of tenants) {
              const depts = await adminService.getTenantDepartmentsByName(tenant);
              allDepts.push(...depts);
            }
            setDepartments([...new Set(allDepts)]); 
          } else {
            const depts = await adminService.getTenantDepartmentsByName(formData.CompanyName);
            setDepartments(depts);
          }
        } catch (error) {
        }
      };
      fetchDepartments();
    }
  }, [formData.CompanyName, formData.Role, tenants]);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/\d/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
    return errors;
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.endsWith('@gmail.com')) return;
    
    setEmailCheckLoading(true);
    try {
      await authService.register({ Email: email });
    } catch (err: any) {
      const fullErrorString = JSON.stringify(err.response || err).toLowerCase();
      if (fullErrorString.includes('email') && (fullErrorString.includes('already') || fullErrorString.includes('exists') || fullErrorString.includes('duplicate'))) {
        setFieldErrors((prev: any) => ({ ...prev, Email: 'Email already exists' }));
      }
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    const passwordErrors = validatePassword(formData.Password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain ${passwordErrors.join(', ')}.`);
      setLoading(false);
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match. Please ensure both password fields are identical.');
      setLoading(false);
      return;
    }

    try {
      const submitData: any = {
        UserName: formData.UserName,
        Email: formData.Email,
        Password: formData.Password,
        ConfirmPassword: formData.ConfirmPassword,
        Role: formData.Role,
        CompanyName: formData.CompanyName
      };
      
      if (formData.Role !== 'Manager' && formData.Department) {
        submitData.Department = formData.Department;
      }
      
      await authService.register(submitData);
      setSuccess('Registration request submitted successfully! Redirecting to login...');
      setFormData({
        UserName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Role: '',
        Department: '',
        CompanyName: ''
      });
      setFieldErrors({});
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      
      const fullErrorString = JSON.stringify(err.response || err).toLowerCase();
      if (fullErrorString.includes('email') && (fullErrorString.includes('already') || fullErrorString.includes('exists') || fullErrorString.includes('duplicate'))) {
        setFieldErrors({ Email: 'Email already exists' });
        return;
      }
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const newFieldErrors: any = {};
        
        if (errors.Department) {
          newFieldErrors.Department = 'Department is required';
        }
        if (errors.CompanyName) {
          newFieldErrors.CompanyName = 'Company name is required';
        }
        if (errors.UserName) {
          newFieldErrors.UserName = 'Name is required and must be valid';
        }
        if (errors.Email) {
          newFieldErrors.Email = 'Email already exists';
        }
        if (errors.Password) {
          newFieldErrors.Password = 'Password must contain at least 8 characters, uppercase, lowercase, number, and special character';
        }
        
        setFieldErrors(newFieldErrors);
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.UserName}
              onChange={(e) => {
                setFormData({ ...formData, UserName: e.target.value });
                if (fieldErrors.UserName) {
                  setFieldErrors({ ...fieldErrors, UserName: '' });
                }
              }}
              required
              error={!!fieldErrors.UserName}
              helperText={fieldErrors.UserName}
              sx={{ mb: 3, ...textFieldStyles }}
            />
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={formData.Email}
              onChange={(e) => {
                setFormData({ ...formData, Email: e.target.value });
                if (fieldErrors.Email) {
                  setFieldErrors({ ...fieldErrors, Email: '' });
                }
                if (e.target.value.endsWith('@gmail.com')) {
                  checkEmailAvailability(e.target.value);
                }
              }}
              required
              error={!!fieldErrors.Email}
              helperText={fieldErrors.Email || "Must end with @gmail.com"}
              InputProps={{
                endAdornment: emailCheckLoading ? <CircularProgress size={20} /> : null
              }}
              sx={{ mb: 3, ...textFieldStyles }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <FormControl fullWidth sx={{ mb: 3, ...selectStyles }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.Role}
                onChange={(e) => {
                  setFormData({ ...formData, Role: e.target.value, CompanyName: '', Department: '' });
                  setDepartments([]);
                }}
                required
              >
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="DeptManager">Department Manager</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
              </Select>
            </FormControl>
            {formData.Role && (
              <>
                {formData.Role === 'Manager' ? (
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.CompanyName}
                    onChange={(e) => {
                      setFormData({ ...formData, CompanyName: e.target.value });
                      if (fieldErrors.CompanyName) {
                        setFieldErrors({ ...fieldErrors, CompanyName: '' });
                      }
                    }}
                    required
                    error={!!fieldErrors.CompanyName}
                    helperText={fieldErrors.CompanyName || "Create your new company"}
                    sx={{ mb: 3, ...textFieldStyles }}
                  />
                ) : (
                  <FormControl fullWidth sx={{ mb: 3, ...selectStyles }}>
                    <InputLabel>Company</InputLabel>
                    <Select
                      value={formData.CompanyName}
                      onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })}
                      required
                    >
                      {tenants.map((tenant) => (
                        <MenuItem key={tenant} value={tenant}>{tenant}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {formData.Role !== 'Manager' && (
                  <FormControl fullWidth sx={{ mb: 3, ...selectStyles }} error={!!fieldErrors.Department}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.Department}
                      onChange={(e) => {
                        setFormData({ ...formData, Department: e.target.value });
                        if (fieldErrors.Department) {
                          setFieldErrors({ ...fieldErrors, Department: '' });
                        }
                      }}
                      required
                      disabled={!formData.CompanyName}
                    >
                      {departments.filter(dept => dept.toLowerCase() !== 'none').map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.Department && (
                      <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, ml: 1.75 }}>
                        {fieldErrors.Department}
                      </Typography>
                    )}
                  </FormControl>
                )}
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.Password}
              onChange={(e) => {
                setFormData({ ...formData, Password: e.target.value });
                if (fieldErrors.Password) {
                  setFieldErrors({ ...fieldErrors, Password: '' });
                }
              }}
              required
              error={!!fieldErrors.Password}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#64748b' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
              helperText={fieldErrors.Password || "Must contain at least 8 characters, uppercase, lowercase, number, and special character"}
              sx={{ mb: 3, ...textFieldStyles }}
            />
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={formData.ConfirmPassword}
              onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#64748b' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
              sx={{ mb: 3, ...textFieldStyles }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.9)',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.95)'
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.1)'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#1e293b !important',
      fontWeight: 500,
      fontSize: '1rem',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: '0 8px',
      '&.Mui-focused': {
        color: '#1e293b !important',
        fontWeight: 600
      },
      '&.MuiInputLabel-shrink': {
        backgroundColor: 'white',
        padding: '0 8px'
      }
    }
  };

  const selectStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.9)',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.95)'
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.1)'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#1e293b !important',
      fontWeight: 500,
      fontSize: '1rem',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: '0 8px',
      '&.Mui-focused': {
        color: '#1e293b !important',
        fontWeight: 600
      },
      '&.MuiInputLabel-shrink': {
        backgroundColor: 'white',
        padding: '0 8px'
      }
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.UserName || !formData.Email) {
        setError('Please fill in all required fields');
        return;
      }
      if (!formData.Email.endsWith('@gmail.com')) {
        setError('Email must end with @gmail.com');
        return;
      }
      if (fieldErrors.Email) {
        setError('Please fix the email error before proceeding');
        return;
      }
      if (formData.UserName.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return;
      }
    }
    if (activeStep === 1) {
      if (!formData.Role) {
        setError('Please select a role');
        return;
      }
      if (!formData.CompanyName) {
        setError('Please select or enter a company name');
        return;
      }
      if (formData.Role !== 'Manager' && !formData.Department) {
        setError('Please select a department');
        return;
      }
      if (Object.keys(fieldErrors).length > 0) {
        setError('Please fix all errors before proceeding');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{
        maxWidth: 1000,
        width: '100%',
        display: 'flex',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        minHeight: 650
      }}>
        {/* Left Side - Welcome Section */}
        <Box sx={{ 
          flex: 1, 
          background: `linear-gradient(135deg, rgba(107, 114, 128, 0.9) 0%, rgba(75, 85, 99, 0.9) 50%, rgba(55, 65, 81, 0.9) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}>
          <Box sx={{ textAlign: 'center', maxWidth: 350, zIndex: 1 }}>
            <PersonAdd sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}>
              Join Our Platform
            </Typography>
            <Typography variant="h6" sx={{ 
              opacity: 0.9, 
              lineHeight: 1.6,
              fontWeight: 300,
              mb: 4
            }}>
              Create your account and become part of our growing community
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, opacity: 0.7 }}>
              <Person sx={{ fontSize: 24 }} />
              <Business sx={{ fontSize: 24 }} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 4, sm: 6 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
            <Typography variant="h4" sx={{ 
              mb: 1, 
              fontWeight: 700, 
              color: '#1e293b',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Fill in your details to get started
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{
                  '& .MuiStepLabel-label': {
                    color: '#64748b',
                    fontWeight: 500
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    color: '#1e293b',
                    fontWeight: 600
                  }
                }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
              }}
            >
              {success}
            </Alert>
          )}

          <Box sx={{ flex: 1 }}>
            {getStepContent()}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: '#64748b',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(100, 116, 139, 0.1)'
                }
              }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
                  boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b6470 0%, #3f4651 50%, #2d3748 100%)',
                    boxShadow: '0 12px 35px rgba(107, 114, 128, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
                  boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b6470 0%, #3f4651 50%, #2d3748 100%)',
                    boxShadow: '0 12px 35px rgba(107, 114, 128, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Already have an account?{' '}
              <Button 
                variant="text" 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: '#6b7280', 
                  p: 0, 
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Register;