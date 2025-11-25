import { useState, useEffect } from 'react';
import { getUserRole } from '../utils/auth';
import { userService, adminService } from '../services';

export default function useUserDetails() {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const userRole = getUserRole();

  const searchFields = userRole === 'Manager' ? [
    { key: 'departmentName', label: 'Department' },
    { key: 'userName', label: 'User Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ] : [
    { key: 'userName', label: 'User Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'departmentName', label: 'Department' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUserId = localStorage.getItem('userId') || localStorage.getItem('USER_ID');
        
        if (userRole === 'DeptManager') {
          const currentUser = await userService.getCurrentUser();
          const currentUserDept = currentUser.department || currentUser.departmentName || currentUser.Department || currentUser.DepartmentName;
          
          if (currentUserDept) {
            const departmentUsers = await userService.getUsersByDepartment(currentUserDept);
           
            const filteredUsersData = departmentUsers.filter((user: any) => 
              user.role !== 'Manager' && user.userId !== currentUserId
            );
            
            setUsers(filteredUsersData);
            setDepartments([{ name: currentUserDept, userCount: filteredUsersData.length }]);
            setFilteredUsers(filteredUsersData);
          } else {
            setUsers([]);
            setDepartments([]);
            setFilteredUsers([]);
          }
        } else {
          const [usersData, tenantsData] = await Promise.all([
            userService.getUsers(),
            adminService.getTenants()
          ]);
          
          const filteredUsersData = usersData.filter((user: any) => user.userId !== currentUserId);
          
          const departmentMap = new Map();
          filteredUsersData.forEach((user: any) => {
            if (user.departmentName && user.departmentName !== 'None') {
              const dept = departmentMap.get(user.departmentName) || { name: user.departmentName, userCount: 0 };
              dept.userCount++;
              departmentMap.set(user.departmentName, dept);
            }
          });
          
          const departmentsData = Array.from(departmentMap.values());
          
          setUsers(filteredUsersData);
          setDepartments(departmentsData);
          setFilteredUsers(filteredUsersData);
        }
      } catch (error) {
        setUsers([]);
        setDepartments([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'employee': return 'success';
      default: return 'primary';
    }
  };

  return {
    users,
    departments,
    loading,
    selectedDepartment,
    filteredUsers,
    userRole,
    searchFields,
    setSelectedDepartment,
    setFilteredUsers,
    getRoleColor
  };
}