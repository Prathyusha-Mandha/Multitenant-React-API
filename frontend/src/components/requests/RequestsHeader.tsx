import { Box, Typography } from '@mui/material';
import { Assignment } from '@mui/icons-material';

interface RequestsHeaderProps {
  requestCount: number;
}

export default function RequestsHeader({ requestCount }: RequestsHeaderProps) {
  return (
    <Box sx={{ mb: 4, borderLeft: '4px solid #1976d2', pl: 3 }}>
      <Typography variant="h4" sx={{
        color: '#ffffff',
        fontWeight: 600,
        mb: 0.5,
        letterSpacing: '0.5px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Assignment />
        Registration Requests
      </Typography>
      <Typography variant="body1" sx={{ 
        color: '#ffffff',
        fontStyle: 'italic',
        textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
      }}>
        Manage pending registration requests • {requestCount} requests
      </Typography>
    </Box>
  );
}