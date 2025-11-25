import { Box, Typography, Card } from '@mui/material';
import { NotificationsNone } from '@mui/icons-material';

export default function EmptyNotifications() {
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
        <NotificationsNone sx={{ fontSize: 64 }} />
      </Box>
      <Typography variant="h5" sx={{ color: '#1976d2', mb: 2, fontWeight: 600 }}>
        No Notifications
      </Typography>
      <Typography variant="body1" sx={{ color: '#666' }}>
        You're all caught up! No new notifications at this time.
      </Typography>
    </Card>
  );
}