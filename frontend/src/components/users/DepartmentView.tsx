import { Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip } from '@mui/material';
import { ArrowBack, Group, Person } from '@mui/icons-material';
import { SearchFilter } from '../Common';

interface DepartmentViewProps {
  selectedDepartment: string;
  filteredUsers: any[];
  onBack: () => void;
  getRoleColor: (role: string) => string;
  deptUsers: any[];
  searchFields: any[];
  onFilter: (filtered: any[]) => void;
}

export default function DepartmentView({ selectedDepartment, filteredUsers, onBack, getRoleColor, deptUsers, searchFields, onFilter }: DepartmentViewProps) {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', bgcolor: 'transparent' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: { xs: 3, sm: 4 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ borderLeft: '4px solid #1976d2', pl: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{
            color: '#ffffff',
            fontWeight: 600,
            mb: 0.5,
            letterSpacing: '0.5px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Group sx={{ fontSize: { xs: '2rem', sm: '2.125rem' } }} />
            {selectedDepartment} Department
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#ffffff',
            fontStyle: 'italic',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            {filteredUsers.length} users in this department
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            alignSelf: { xs: 'center', sm: 'flex-start' },
            minWidth: { xs: '120px', sm: 'auto' }
          }}
        >
          Back
        </Button>
      </Box>

      <SearchFilter data={deptUsers} onFilter={onFilter} searchFields={searchFields} />

      {filteredUsers.length === 0 ? (
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
          p: { xs: 4, sm: 6 }
        }}>
          <Group sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#1976d2', mb: 2, fontWeight: 600 }}>
            No Users Found
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No users found in the {selectedDepartment} department.
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{
          background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.1)' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Join Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user: any) => {
                const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
                
                return (
                  <TableRow key={user.userId || user.id} sx={{
                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.05)' }
                  }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976d2' }}>
                          {getInitials(user.userName)}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {user.userName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {user.userId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" color="primary" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}