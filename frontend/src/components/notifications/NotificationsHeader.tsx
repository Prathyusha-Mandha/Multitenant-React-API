import { Box, Typography } from '@mui/material';
import { Notifications } from '@mui/icons-material';

interface NotificationsHeaderProps {
  notificationCount: number;
}

export default function NotificationsHeader({ notificationCount }: NotificationsHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ borderLeft: '4px solid #1976d2', pl: 3 }}>
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
          <Notifications />
          Notifications
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#ffffff',
          fontStyle: 'italic',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
        }}>
          Stay updated with your latest activities • {notificationCount} notifications
        </Typography>
      </Box>
    </Box>
  );
}