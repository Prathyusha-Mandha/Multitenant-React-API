import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Box, Typography, Card, CardContent, useTheme, useMediaQuery, Divider } from '@mui/material';
import { Person, Email, Business, CalendarToday } from '@mui/icons-material';

interface UserTableProps {
  users: any[];
  headers: string[];
  getRoleColor: (role: string) => string;
  showDepartment?: boolean;
  showJoinDate?: boolean;
}

export default function UserTable({ users, headers, getRoleColor, showDepartment = false, showJoinDate = false }: UserTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const commonStyles = {
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.95) 0%, rgba(75, 85, 99, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 4,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    tableRowStyle: {
      transition: 'all 0.2s ease',
      '&:hover': { backgroundColor: 'rgba(156, 163, 175, 0.15)', transform: 'scale(1.01)' },
      '&:nth-of-type(even)': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
      '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
    },
    avatarStyle: {
      width: 45,
      height: 45,
      bgcolor: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
      boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
    }
  };
  
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };
  
  // Mobile card layout
  if (isMobile) {
    return (
      <Box sx={{ mt: 3 }}>
        {users.map((user: any) => (
          <Card key={user.userId || user.id} sx={{
            ...commonStyles.cardStyle,
            mb: 2,
            p: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
            }
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{
                  ...commonStyles.avatarStyle,
                  width: 50,
                  height: 50
                }}>
                  {getInitials(user.userName)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{
                    color: '#f3f4f6',
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: '1.1rem'
                  }}>
                    {user.userName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#d1d5db',
                    fontFamily: 'monospace',
                    fontWeight: 600
                  }}>
                    ID: {user.userId || 'N/A'}
                  </Typography>
                </Box>
                <Chip 
                  label={user.role || 'N/A'} 
                  color={getRoleColor(user.role) as any} 
                  size="small" 
                  sx={{ fontWeight: 600 }} 
                />
              </Box>
              
              <Divider sx={{ mb: 2, opacity: 0.3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: '#d1d5db' }} />
                  <Typography variant="body2" sx={{
                    color: '#e5e7eb',
                    fontSize: '0.85rem',
                    wordBreak: 'break-word'
                  }}>
                    {user.email || 'N/A'}
                  </Typography>
                </Box>
                
                {showDepartment && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ fontSize: 16, color: '#d1d5db' }} />
                    <Typography variant="body2" sx={{
                      color: '#e5e7eb',
                      fontWeight: 500,
                      fontSize: '0.85rem'
                    }}>
                      {user.departmentName || 'N/A'}
                    </Typography>
                  </Box>
                )}
                
                {showJoinDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: '#d1d5db' }} />
                    <Typography variant="body2" sx={{
                      color: '#e5e7eb',
                      fontWeight: 500,
                      fontSize: '0.85rem'
                    }}>
                      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop table layout
  return (
    <TableContainer component={Paper} sx={{ 
      mt: 3, 
      ...commonStyles.cardStyle, 
      overflow: 'auto',
      maxWidth: '100%'
    }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ 
            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(107, 114, 128, 0.2) 100%)', 
            '& th': { borderBottom: '2px solid rgba(156, 163, 175, 0.3)' } 
          }}>
            {headers.map((header: string) => (
              <TableCell key={header} sx={{ 
                fontWeight: 700, 
                color: '#f3f4f6', 
                fontSize: '1rem', 
                fontFamily: 'Roboto, Arial, sans-serif',
                whiteSpace: 'nowrap'
              }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.userId || user.id} sx={commonStyles.tableRowStyle}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                  <Avatar sx={commonStyles.avatarStyle}>
                    {getInitials(user.userName)}
                  </Avatar>
                  {showJoinDate ? (
                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: '#f3f4f6', 
                        fontWeight: 600, 
                        mb: 0.5, 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '1rem'
                      }}>
                        {user.userName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#d1d5db', 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.85rem'
                      }}>
                        {user.departmentName || 'N/A'}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h6" sx={{ 
                      color: '#f3f4f6', 
                      fontWeight: 600, 
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '1rem'
                    }}>
                      {user.userName || 'N/A'}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body1" sx={{ 
                  color: '#e5e7eb', 
                  fontWeight: 600, 
                  fontFamily: 'Courier New, monospace', 
                  fontSize: '0.9rem'
                }}>
                  {user.userId || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                  <Email sx={{ fontSize: 18, color: '#d1d5db' }} />
                  <Typography variant="body2" sx={{ 
                    color: '#e5e7eb', 
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '0.85rem',
                    wordBreak: 'break-word'
                  }}>
                    {user.email || 'N/A'}
                  </Typography>
                </Box>
              </TableCell>
              {showDepartment && (
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    color: '#e5e7eb', 
                    fontWeight: 500, 
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '0.85rem'
                  }}>
                    {user.departmentName || 'N/A'}
                  </Typography>
                </TableCell>
              )}
              <TableCell>
                <Chip 
                  label={user.role || 'N/A'} 
                  color={getRoleColor(user.role) as any} 
                  size="small" 
                  sx={{ fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                />
              </TableCell>
              {showJoinDate && (
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    color: '#e5e7eb', 
                    fontWeight: 500, 
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap'
                  }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}