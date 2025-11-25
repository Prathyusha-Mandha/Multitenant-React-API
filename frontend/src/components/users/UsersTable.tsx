import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box } from '@mui/material';

interface User {
  userId: string;
  userName: string;
  email: string;
  role: string;
  departmentName?: string;
}

interface UsersTableProps {
  users: User[];
  filteredUsers: User[];
}

export default function UsersTable({ users, filteredUsers }: UsersTableProps) {
  const displayUsers = filteredUsers.length > 0 ? filteredUsers : users;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '#f44336';
      case 'manager': return '#ff9800';
      case 'employee': return '#4caf50';
      default: return '#2196f3';
    }
  };

  if (displayUsers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No users found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Department</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayUsers.map((user) => (
            <TableRow key={user.userId} sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.05)' } }}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip 
                  label={user.role} 
                  size="small" 
                  sx={{ 
                    backgroundColor: getRoleColor(user.role),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </TableCell>
              <TableCell>{user.departmentName || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}