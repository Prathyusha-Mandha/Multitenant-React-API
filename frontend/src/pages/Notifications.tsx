import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Stack, Typography, Card, IconButton } from '@mui/material';
import { Close, Error } from '@mui/icons-material';
import { notificationService } from '../services';
import { NotificationsHeader, NotificationCard, EmptyNotifications } from '../components/notifications';
import { UI_TEXT } from '../services/constants';

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        
        let notificationsList: any[] = [];
        if (data && data.notifications && Array.isArray(data.notifications)) {
          notificationsList = data.notifications;
        } else if (Array.isArray(data)) {
          notificationsList = data;
        }
        
        const uniqueNotifications = notificationsList.filter((notification: any, index: number, self: any[]) => 
          index === self.findIndex((n: any) => 
            (n.notificationId && notification.notificationId && n.notificationId === notification.notificationId) ||
            (!n.notificationId && !notification.notificationId && 
             n.notificationMessage === notification.notificationMessage &&
             n.createdAt === notification.createdAt)
          )
        );
        
        setNotifications(uniqueNotifications);
      } catch (error: any) {
        setError(error?.message || UI_TEXT.ERROR_OCCURRED);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);



  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>{UI_TEXT.LOADING_NOTIFICATIONS}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'transparent' }}>
      <NotificationsHeader
        notificationCount={notifications.length}
      />
      
      {error && (
        <Card sx={{
          mb: 3,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(239, 68, 68, 0.3)',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Error sx={{ color: '#ef4444', fontSize: 24 }} />
          <Typography sx={{ color: '#dc2626', fontWeight: 500, flex: 1 }}>
            {error}
          </Typography>
          <IconButton size="small" onClick={() => setError('')} sx={{ color: '#ef4444' }}>
            <Close fontSize="small" />
          </IconButton>
        </Card>
      )}
      
      <Stack spacing={3}>
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          notifications.map((notification: any, index: number) => (
            <NotificationCard
              key={notification.notificationId || index}
              notification={notification}
              index={index}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}

export default Notifications;