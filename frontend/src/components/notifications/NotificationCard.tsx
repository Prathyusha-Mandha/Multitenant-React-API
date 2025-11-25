import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Info, Warning, Error, CheckCircle } from '@mui/icons-material';

interface NotificationCardProps {
  notification: any;
  index: number;
}

export default function NotificationCard({ notification}: NotificationCardProps) {
  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'error': return <Error sx={{ color: '#f44336' }} />;
      case 'warning': return <Warning sx={{ color: '#ff9800' }} />;
      case 'success': return <CheckCircle sx={{ color: '#4caf50' }} />;
      default: return <Info sx={{ color: '#2196f3' }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'success': return '#4caf50';
      default: return '#2196f3';
    }
  };

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {getIcon(notification.type)}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                {notification.title || 'Notification'}
              </Typography>
              {notification.type && (
                <Chip 
                  label={notification.type} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getTypeColor(notification.type),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
            <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
              {notification.notificationMessage || notification.message || 'No message'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Unknown time'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}