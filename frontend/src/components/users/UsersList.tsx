import {  Typography, Box, Chip, Button} from '@mui/material';
import { Message } from '@mui/icons-material';

interface User {
  userId: string;
  userName: string;
  role: string;
  email?: string;
  departmentName?: string;
  department?: string;
}

interface UsersListProps {
  users: User[];
  filteredUsers: User[];
  onSelectUser: (user: any) => void;
  getRoleColor: (role: string) => string;
  showMessageButton?: boolean;
}

export default function UsersList({ users, filteredUsers, onSelectUser, getRoleColor, showMessageButton = true }: UsersListProps) {
  const displayUsers = filteredUsers.length > 0 ? filteredUsers : users;

  if (displayUsers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No users available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, overflowX: 'auto' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderRadius: 2,
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2, md: 3 }, flex: 1, minWidth: 700 }}>
          <Box sx={{ width: { xs: 80, sm: 100, md: 120 }, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              ID
            </Typography>
          </Box>
          <Box sx={{ width: { xs: 100, sm: 120, md: 150 }, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              Name
            </Typography>
          </Box>
          <Box sx={{ width: { xs: 150, sm: 180, md: 200 }, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              Email
            </Typography>
          </Box>
          <Box sx={{ width: { xs: 100, sm: 110, md: 130 }, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              Department
            </Typography>
          </Box>
          <Box sx={{ width: { xs: 80, sm: 100, md: 120 }, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              Role
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {displayUsers.map((user) => {
        return (
          <Box
            key={user.userId}
            sx={{
              background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 2,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              p: 2,
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2, md: 3 }, flex: 1, minWidth: 700 }}>
              <Box sx={{ width: { xs: 80, sm: 100, md: 120 }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ color: '#d32f2f', fontFamily: 'Arial, sans-serif', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }, fontWeight: 700, letterSpacing: '0.5px' }}>
                  {user.userId}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: 100, sm: 120, md: 150 }, textAlign: 'left' }}>
                <Typography variant="subtitle1" sx={{ color: '#1565c0', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                  {user.userName}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: 150, sm: 180, md: 200 }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ color: '#424242', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, fontWeight: 500, wordBreak: 'break-word' }}>
                  {user.email || 'No email'}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: 100, sm: 110, md: 130 }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ color: '#6a1b9a', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, fontWeight: 600 }}>
                  {user.departmentName || user.department || 'No department'}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: 80, sm: 100, md: 120 }, textAlign: 'left' }}>
                <Chip 
                  label={user.role} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getRoleColor(user.role) === 'error' ? '#f44336' : 
                                   getRoleColor(user.role) === 'warning' ? '#ff9800' : 
                                   getRoleColor(user.role) === 'success' ? '#4caf50' : '#2196f3',
                    color: 'white',
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
            {showMessageButton && (
              <Button
                variant="contained"
                startIcon={<Message />}
                onClick={() => onSelectUser(user)}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Message
              </Button>
            )}
          </Box>
        );
      })}
    </Box>
  );
}