import { useState, useEffect } from 'react';
import { Box, Card, Container, CircularProgress } from '@mui/material';
import UsersHeader from '../components/users/UsersHeader';
import { SearchFilter } from '../components/Common';
import UsersTable from '../components/users/UsersTable';
import { userService } from '../services';


function ManagerUserDetails() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTenantUsers = async () => {
      try {
        const currentTenantId = localStorage.getItem('tenantId');
        const currentTenantName = localStorage.getItem('tenantName');
        
        const allUsers = await userService.getUsers();
        const tenantUsers = allUsers.filter((user: any) => 
          user.tenantId === currentTenantId || user.tenantName === currentTenantName
        );
        
        setUsers(tenantUsers);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenantUsers();
  }, []);

  if (loading) return (
    <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'transparent' }}>
      <UsersHeader />
      
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        mb: 2,
        p: 2
      }}>
        <SearchFilter 
          data={users}
          onFilter={setFilteredUsers}
          searchFields={[
            { key: 'userName', label: 'User Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'departmentName', label: 'Department' }
          ]}
        />
      </Card>
      
      <UsersTable users={users} filteredUsers={filteredUsers} />
    </Box>
  );
}

export default ManagerUserDetails;