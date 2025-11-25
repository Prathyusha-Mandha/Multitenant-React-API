import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import { Email, Business } from '@mui/icons-material';

interface ProfileCardProps {
  user: {
    userName: string;
    email: string;
    role: string;
    department?: string;
    profilePicture?: string;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '#f44336';
      case 'manager': return '#ff9800';
      case 'employee': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getProfileImageUrl = () => {
    if (user.profilePicture) {
      // If it's base64 data, use it directly
      if (user.profilePicture.startsWith('data:image/') || user.profilePicture.startsWith('/9j/')) {
        return user.profilePicture.startsWith('data:image/') 
          ? user.profilePicture 
          : `data:image/jpeg;base64,${user.profilePicture}`;
      }
      if (user.profilePicture.startsWith('http')) {
        return user.profilePicture;
      }
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7198';
      return `${apiBaseUrl}${user.profilePicture.startsWith('/') ? '' : '/'}${user.profilePicture}`;
    }
    return undefined;
  };

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      p: 3
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            src={getProfileImageUrl() || undefined}
            sx={{
              width: 80,
              height: 80,
              fontSize: 32,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              border: '3px solid white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            {user.userName?.charAt(0)?.toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
              {user.userName}
            </Typography>
            <Chip 
              label={user.role} 
              sx={{ 
                backgroundColor: getRoleColor(user.role),
                color: 'white',
                fontWeight: 600,
                mb: 1
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email sx={{ fontSize: 20, color: '#666' }} />
            <Typography variant="body1" sx={{ color: '#666' }}>
              {user.email}
            </Typography>
          </Box>
          
          {user.department && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ fontSize: 20, color: '#666' }} />
              <Typography variant="body1" sx={{ color: '#666' }}>
                {user.department}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}