import { Box, TextField, Button, Typography, Card, CardContent, IconButton } from '@mui/material';
import { LockReset, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

interface ResetStepProps {
  otp: string;
  newPassword: string;
  confirmPassword: string;
  onOtpChange: (otp: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
  errors: any;
}

export default function ResetStep({ 
  otp, 
  newPassword, 
  confirmPassword, 
  onOtpChange, 
  onNewPasswordChange, 
  onConfirmPasswordChange, 
  onSubmit, 
  loading, 
  errors 
}: ResetStepProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
      return 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol';
    }
    return '';
  };

  const passwordError = newPassword ? validatePassword(newPassword) : '';

  return (
    <Card sx={{
      maxWidth: 450,
      width: '100%',
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 4,
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4, justifyContent: 'center' }}>
          <LockReset sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
            Reset Password
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
          Enter the OTP sent to your email and create a new password.
        </Typography>
        
        <TextField
          fullWidth
          label="OTP"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value.trim())}
          error={!!errors.otp}
          helperText={errors.otp}
          inputProps={{ maxLength: 6 }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover fieldset': {
                borderColor: '#1976d2'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2'
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2'
            }
          }}
        />
        
        <TextField
          fullWidth
          type={showNewPassword ? 'text' : 'password'}
          label="New Password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          error={!!passwordError || !!errors.newPassword}
          helperText={passwordError || errors.newPassword}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowNewPassword(!showNewPassword)}
                edge="end"
                sx={{ color: '#666' }}
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )
          }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover fieldset': {
                borderColor: '#1976d2'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2'
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2'
            }
          }}
        />
        
        <TextField
          fullWidth
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ color: '#666' }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )
          }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover fieldset': {
                borderColor: '#1976d2'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2'
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2'
            }
          }}
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={onSubmit}
          disabled={loading || !otp || !newPassword || !confirmPassword || !!passwordError}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
            },
            '&:disabled': {
              background: '#ccc',
              boxShadow: 'none'
            }
          }}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </CardContent>
    </Card>
  );
}