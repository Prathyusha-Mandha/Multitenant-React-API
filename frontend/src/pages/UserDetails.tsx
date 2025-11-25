import React from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Divider,
  Container,
  CircularProgress,
 
} from '@mui/material';
import {
  Email,
  Business,
  CalendarToday,
  People,
  AccountCircle,
  
} from '@mui/icons-material';

import useUserDetails from '../hooks/useUserDetails';
import { SearchFilter } from '../components/Common';
import DepartmentView from '../components/users/DepartmentView';
import DepartmentGrid from '../components/users/DepartmentGrid';

const SIDEBAR_WIDTH = 280;

const commonStyles = {
  cardStyle: {
    background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#1976d2',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }
  },
  headerStyle: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontWeight: 700,
    color: '#1976d2',
    '& svg': { fontSize: 32, color: '#1976d2' }
  },
  avatarStyle: {
    width: 45,
    height: 45,
    bgcolor: '#1976d2',
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
    color: 'white'
  }
};

const UserCard = ({ user, getRoleColor, showDepartment = false, showJoinDate = false }: any) => {
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <Card sx={{ 
      ...commonStyles.cardStyle, 
      p: { xs: 2, sm: 3 }, 
      mb: 2, 
      transition: 'all 0.3s ease', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' } 
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: { xs: 2, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Avatar sx={{ 
          ...commonStyles.avatarStyle, 
          width: { xs: 50, sm: 60 }, 
          height: { xs: 50, sm: 60 }, 
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          alignSelf: { xs: 'center', sm: 'flex-start' }
        }}>
          {getInitials(user.userName)}
        </Avatar>
        <Box sx={{ flex: 1, width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant="h6" sx={{ 
                color: '#1976d2', 
                fontWeight: 700, 
                mb: 0.5, 
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                {user.userName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#666', 
                fontFamily: 'monospace', 
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                ID: {user.userId || 'N/A'}
              </Typography>
            </Box>
            <Chip 
              label={user.role || 'N/A'} 
              color={getRoleColor(user.role) as any} 
              size={window.innerWidth < 600 ? 'small' : 'medium'} 
              sx={{ 
                fontWeight: 600, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                alignSelf: { xs: 'center', sm: 'flex-start' }
              }} 
            />
          </Box>
          <Divider sx={{ mb: 2, opacity: 0.2 }} />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1.5
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Email sx={{ fontSize: { xs: 16, sm: 18 }, color: '#666' }} />
              <Typography variant="body2" sx={{ 
                color: '#333',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                wordBreak: 'break-word'
              }}>
                {user.email || 'N/A'}
              </Typography>
            </Box>
            {showDepartment && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Business sx={{ fontSize: { xs: 16, sm: 18 }, color: '#666' }} />
                <Typography variant="body2" sx={{ 
                  color: '#333', 
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  {user.departmentName || 'N/A'}
                </Typography>
              </Box>
            )}
            {showJoinDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <CalendarToday sx={{ fontSize: { xs: 16, sm: 18 }, color: '#666' }} />
                <Typography variant="body2" sx={{ 
                  color: '#333', 
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const UserGrid = ({ users, getRoleColor, showDepartment = false, showJoinDate = false }: any) => (
  <Box sx={{ mt: 3 }}>
    {users.map((user: any) => (
      <UserCard key={user.userId || user.id} user={user} getRoleColor={getRoleColor} showDepartment={showDepartment} showJoinDate={showJoinDate} />
    ))}
  </Box>
);

const EmptyState = ({ title, subtitle }: any) => (
  <Card sx={{ 
    ...commonStyles.cardStyle, 
    textAlign: 'center', 
    p: { xs: 4, sm: 6 }, 
    mt: 3 
  }}>
    <People sx={{ 
      fontSize: { xs: 60, sm: 80 }, 
      color: '#1976d2', 
      mb: 3, 
      opacity: 0.7 
    }} />
    <Typography variant="h5" sx={{ 
      color: '#1976d2', 
      mb: 2, 
      fontWeight: 600,
      fontSize: { xs: '1.25rem', sm: '1.5rem' }
    }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ 
      color: '#666',
      fontSize: { xs: '0.9rem', sm: '1rem' }
    }}>
      {subtitle}
    </Typography>
  </Card>
);

const ProfileInfoHeading = () => (
  <Card sx={{ ...commonStyles.cardStyle, mb: 3, p: 3 }}>
    <Typography variant="h4" sx={{ ...commonStyles.headerStyle }}>
      <AccountCircle sx={{ fontSize: 32, color: '#ecedeeff' }} />
      User Management 
    </Typography>
    <Typography variant="body1" sx={{ color: '#e5e7eb', mt: 1 }}>
      Manage and view user profiles across the organization
    </Typography>
  </Card>
);

function UserDetails() {
  const { users, departments, loading, selectedDepartment, filteredUsers, userRole, searchFields, setSelectedDepartment, setFilteredUsers, getRoleColor } = useUserDetails();
  const [filteredDepartments, setFilteredDepartments] = React.useState(departments);
  
  React.useEffect(() => {
    setFilteredDepartments(departments);
  }, [departments]);

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;

  // For department managers, show users directly without department selection
  if (userRole === 'DeptManager') {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          mb: { xs: 3, sm: 4 }, 
          borderLeft: '4px solid #9ca3af', 
          pl: { xs: 2, sm: 3 }
        }}>
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
            <People sx={{ fontSize: { xs: '2rem', sm: '2.125rem' } }} />
            Department Users
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#ffffff',
            fontStyle: 'italic',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            Manage users in your department • {users.length} users
          </Typography>
        </Box>
        
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.95) 0%, rgba(75, 85, 99, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          mb: 3,
          p: { xs: 1.5, sm: 2 }
        }}>
          <SearchFilter 
            data={users}
            onFilter={setFilteredUsers}
            searchFields={searchFields}
          />
        </Card>
        
        {filteredUsers.length === 0 ? (
          <EmptyState 
            title="No Users Found" 
            subtitle="No users found in your department." 
          />
        ) : (
          <UserGrid 
            users={filteredUsers} 
            getRoleColor={getRoleColor} 
            showDepartment={false}
            showJoinDate={true}
          />
        )}
      </Box>
    );
  }

  if (selectedDepartment) {
    const deptUsers = users.filter((user: any) => user.departmentName === selectedDepartment && user.role !== 'Manager');
    return (
      <DepartmentView 
        selectedDepartment={selectedDepartment} 
        filteredUsers={filteredUsers} 
        onBack={() => setSelectedDepartment(null)} 
        getRoleColor={getRoleColor}
        deptUsers={deptUsers}
        searchFields={searchFields}
        onFilter={setFilteredUsers}
      />
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        mb: { xs: 3, sm: 4 }, 
        borderLeft: '4px solid #9ca3af', 
        pl: { xs: 2, sm: 3 }
      }}>
        <Typography variant="h4" sx={{
          color: '#ffffff',
          fontWeight: 600,
          mb: 0.5,
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <People sx={{ fontSize: { xs: '2rem', sm: '2.125rem' } }} />
          User Management 
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#ffffff',
          fontStyle: 'italic',
          fontSize: { xs: '0.9rem', sm: '1rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          Browse users by department and manage user access • {departments.length} departments
        </Typography>
      </Box>
      
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        mb: 3,
        p: { xs: 1.5, sm: 2 }
      }}>
        <SearchFilter 
          data={departments}
          onFilter={setFilteredDepartments}
          searchFields={[
            { key: 'name', label: 'Department Name' }
          ]}
        />
      </Card>
      
      <DepartmentGrid 
        departments={filteredDepartments}
        onDepartmentClick={setSelectedDepartment}
      />
    </Box>
  );
}

export default UserDetails;