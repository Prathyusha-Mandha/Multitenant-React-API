import { Box, Typography, Card } from '@mui/material';
import { Assignment, Search } from '@mui/icons-material';

interface EmptyRequestsProps {
  hasRequests: boolean;
}

export default function EmptyRequests({ hasRequests }: EmptyRequestsProps) {
  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      textAlign: 'center',
      p: 6
    }}>
      <Box sx={{ mb: 2, color: '#1976d2' }}>
        {hasRequests ? (
          <Search sx={{ fontSize: 64 }} />
        ) : (
          <Assignment sx={{ fontSize: 64 }} />
        )}
      </Box>
      <Typography variant="h5" sx={{ color: '#1976d2', mb: 2, fontWeight: 600 }}>
        {hasRequests ? 'No Matching Requests' : 'No Registration Requests'}
      </Typography>
      <Typography variant="body1" sx={{ color: '#666' }}>
        {hasRequests 
          ? 'No requests match your current search criteria.'
          : 'There are no pending registration requests at this time.'
        }
      </Typography>
    </Card>
  );
}