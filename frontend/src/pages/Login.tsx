import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Card, IconButton } from '@mui/material';
import { Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../services/constants';

const Login = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token || '');
      localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId || '');
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.role || '');
      localStorage.setItem(STORAGE_KEYS.USER_NAME, response.userName || '');
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
        maxWidth: 900,
        width: '100%',
        display: 'flex',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        minHeight: 600
      }}>
        <Box sx={{ 
          flex: 1, 
          background: `linear-gradient(135deg, rgba(107, 114, 128, 0.9) 0%, rgba(75, 85, 99, 0.9) 50%, rgba(55, 65, 81, 0.9) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`,
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
            background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}>
          <Box sx={{ textAlign: 'center', maxWidth: 350, zIndex: 1 }}>
            <LoginIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}>
              Welcome Back
            </Typography>
            <Typography variant="h6" sx={{ 
              opacity: 0.9, 
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Sign in to access your dashboard and manage your organization efficiently
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: { xs: 4, sm: 6 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                mb: 1, 
                fontWeight: 700, 
                color: '#1e293b',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                Sign In
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                Enter your credentials to continue
              </Typography>
            </Box>

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

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="User ID"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.1)'
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
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
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.1)'
                    }
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  py: 2, 
                  mb: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
                  boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b6470 0%, #3f4651 50%, #2d3748 100%)',
                    boxShadow: '0 12px 35px rgba(107, 114, 128, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button 
                variant="text" 
                onClick={() => navigate('/forgot-password')}
                sx={{ 
                  color: '#6b7280',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(107, 114, 128, 0.1)'
                  }
                }}
              >
                Forgot Password?
              </Button>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Don't have an account?{' '}
                <Button 
                  variant="text" 
                  onClick={() => navigate('/register')}
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
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;