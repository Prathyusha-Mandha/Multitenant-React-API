import { Box, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';

export default function ProfileHeader() {
  return (
    <Box sx={{ mb: 4, borderLeft: '4px solid #1976d2', pl: 3 }}>
      <Typography variant="h4" sx={{
        color: '#ffffff',
        fontWeight: 700,
        mb: 1,
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        <Person />
        My Profile
      </Typography>
      <Typography variant="h6" sx={{ 
        color: '#ffffff',
        fontWeight: 500,
        fontSize: '1.1rem',
        textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
      }}>
        Manage your personal information and settings
      </Typography>
    </Box>
  );
}