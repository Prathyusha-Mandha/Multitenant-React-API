import {  Button, Typography, Card, CardContent } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface SuccessStepProps {
  onBack: () => void;
}

export default function SuccessStep({ onBack }: SuccessStepProps) {
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
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ color: '#4caf50', fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}>
          Password Reset Successful!
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
          Your password has been reset successfully. You can now login with your new password.
        </Typography>
        
        <Button
          fullWidth
          variant="contained"
          onClick={onBack}
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
            }
          }}
        >
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
}