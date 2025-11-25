import { useState, useEffect } from 'react';
import { adminService, userService } from '../services';

export default function useTenantDetails() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [filteredTenants, setFilteredTenants] = useState<any[]>([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        
        const [tenantsData, usersData] = await Promise.all([
          adminService.getTenants(),
          userService.getUsers()
        ]);
        
        const processedTenants = tenantsData.map((tenant: any) => {
          const tenantUsers = usersData.filter((user: any) => 
            user.tenantId === tenant.tenantId || user.tenantName === tenant.tenantName
          );
          
          const manager = tenantUsers.find((user: any) => user.role === 'Manager');
          
          const departmentMap = new Map();
          tenantUsers.forEach((user: any) => {
            if (user.departmentName && user.departmentName !== 'None') {
              const dept = departmentMap.get(user.departmentName) || { name: user.departmentName, userCount: 0 };
              dept.userCount++;
              departmentMap.set(user.departmentName, dept);
            }
          });
          
          return {
            ...tenant,
            managerName: manager?.userName,
            managerId: manager?.userId,
            departments: Array.from(departmentMap.values())
          };
        });
        
        setTenants(processedTenants);
        setFilteredTenants(processedTenants);
      } catch (error) {
        setTenants([]);
        setFilteredTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleTenantClick = (tenant: any) => {
    setSelectedTenant(tenant);
  };

  const handleBackToTenants = () => {
    setSelectedTenant(null);
    setSelectedDepartment(null);
  };

  const handleDepartmentClick = (departmentName: string) => {
    if (selectedTenant) {
      setSelectedDepartment({
        tenantName: selectedTenant.tenantName,
        departmentName
      });
    }
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
  };

  return {
    tenants,
    loading,
    selectedTenant,
    selectedDepartment,
    filteredTenants,
    setFilteredTenants,
    handleTenantClick,
    handleBackToTenants,
    handleDepartmentClick,
    handleBackToDepartments
  };
}