import { Box, TextField, Button, Typography, IconButton, Card, CardContent } from '@mui/material';
import { ArrowBack, Email } from '@mui/icons-material';

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
  onBack: () => void;
}

export default function EmailStep({ email, onEmailChange, onSubmit, loading, error, onBack }: EmailStepProps) {
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={onBack} 
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
            }}
          >
            <ArrowBack sx={{ color: '#1976d2' }} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email sx={{ color: '#1976d2', fontSize: 28 }} />
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
              Reset Password
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
          Enter your email address and we'll send you an OTP to reset your password.
        </Typography>
        
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={!!error}
          helperText={error}
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
          disabled={loading || !email}
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
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </CardContent>
    </Card>
  );
}