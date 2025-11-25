import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { Person, Business } from '@mui/icons-material';

interface ManagerCardProps {
  manager: {
    managerName: string;
    managerId: string;
    tenantName: string;
  };
}

export default function ManagerCard({ manager }: ManagerCardProps) {
  return (
    <Card sx={{
      mb: 3,
      background: 'linear-gradient(135deg, rgba(255, 248, 225, 0.8) 0%, rgba(255, 236, 179, 0.8) 100%)',
      borderRadius: 3,
      boxShadow: '0 4px 15px rgba(255, 193, 7, 0.2)',
      border: '1px solid rgba(255, 193, 7, 0.3)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            fontSize: 24
          }}>
            <Person />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: '#e65100',
              mb: 0.5
            }}>
              {manager.managerName}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ fontSize: 16, color: '#bf360c' }} />
              <Typography variant="body2" sx={{ color: '#bf360c', fontWeight: 500 }}>
                Manager - {manager.tenantName}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}