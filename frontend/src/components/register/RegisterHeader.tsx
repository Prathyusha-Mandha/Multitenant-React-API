import { Box, Typography } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

export default function RegisterHeader() {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Box sx={{
        display: 'inline-flex',
        p: 2,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        mb: 2,
        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
      }}>
        <PersonAdd sx={{ fontSize: 32, color: 'white' }} />
      </Box>
      
      <Typography variant="h4" sx={{
        fontWeight: 700,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 1
      }}>
        Create Account
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
        Join our platform and start collaborating
      </Typography>
    </Box>
  );
}