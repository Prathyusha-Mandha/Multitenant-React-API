import { useState, useEffect } from 'react';
import { Container, CircularProgress } from '@mui/material';
import DepartmentHeader from '../components/departments/DepartmentHeader';
import UsersList from '../components/users/UsersList';
import { SearchFilter } from '../components/Common';
import { userService } from '../services';

interface DepartmentUsersProps {
  tenantName: string;
  departmentName: string;
  onBack: () => void;
}

function DepartmentUsers({ tenantName, departmentName, onBack }: DepartmentUsersProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '#f44336';
      case 'manager': return '#ff9800';
      case 'employee': return '#4caf50';
      default: return '#2196f3';
    }
  };

  useEffect(() => {
    const fetchDepartmentUsers = async () => {
      try {
        const allUsers = await userService.getUsers();
        const departmentUsers = allUsers.filter((user: any) => {
          const userDept = user.departmentName || (user.role === 'Manager' ? 'Manager' : 'Unknown');
          return (user.tenantName === tenantName || user.tenantId === tenantName) && 
                 userDept === departmentName;
        });
        
        setUsers(departmentUsers);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartmentUsers();
  }, [tenantName, departmentName]);

  if (loading) return (
    <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container sx={{ py: 4 }}>
      <DepartmentHeader
        tenantName={tenantName}
        departmentName={departmentName}
        userCount={filteredUsers.length}
        onBack={onBack}
      />
      
      <SearchFilter 
        data={users}
        onFilter={setFilteredUsers}
        searchFields={[
          { key: 'userName', label: 'User Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' }
        ]}
      />
      
      <UsersList 
        users={users} 
        filteredUsers={filteredUsers}
        onSelectUser={() => {}}
        getRoleColor={getRoleColor}
        showMessageButton={false}
      />
    </Container>
  );
}

export default DepartmentUsers;