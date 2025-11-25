import { Box, Button, Card, CardContent, Typography, Alert, CircularProgress, Container, Stack } from '@mui/material';
import { ArrowBack, Business } from '@mui/icons-material';
import { useTenantDetails } from '../hooks';
import DepartmentUsers from './DepartmentUsers';
import { SearchFilter } from '../components/Common';
import { TenantCard, ManagerCard, DepartmentCard } from '../components/tenants';

function TenantDetails() {
  const {
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
  } = useTenantDetails();

  if (loading) return (
    <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  if (selectedDepartment) {
    return (
      <DepartmentUsers 
        tenantName={selectedDepartment.tenantName} 
        departmentName={selectedDepartment.departmentName} 
        onBack={handleBackToDepartments}
      />
    );
  }

  if (selectedTenant) {
    return (
      <Container sx={{ py: 4 }}>
        <Button variant="contained" startIcon={<ArrowBack />} onClick={handleBackToTenants}
          sx={{ mb: 3,
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #5b6470 0%, #3f4651 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)'
            }
          }}>Back to Tenants
        </Button>
        
        <Card sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.6) 0%, rgba(135, 206, 235, 0.6) 100%)',
          borderRadius: 3,
          boxShadow: '0 4px 15px rgba(173, 216, 230, 0.2)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ py: 1, px: 2 }}>
            <Typography variant="h4" sx={{
              color: 'black',
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              {selectedTenant.tenantName}
            </Typography>
          </CardContent>
        </Card>

        {(selectedTenant.managerName || selectedTenant.managerId) && (
          <ManagerCard manager={{
            managerName: selectedTenant.managerName,
            managerId: selectedTenant.managerId,
            tenantName: selectedTenant.tenantName
          }} />
        )}
        
        <Card sx={{
          mb: 2,
          background: 'linear-gradient(135deg, rgba(230, 230, 250, 0.6) 0%, rgba(221, 160, 221, 0.6) 100%)',
          borderRadius: 3,
          boxShadow: '0 4px 15px rgba(230, 230, 250, 0.2)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ py: 0.5, px: 2 }}>
            <Typography variant="h5" sx={{
              color: '#0d47a1',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              textTransform: 'uppercase',
              fontFamily: '"Arial", sans-serif'
            }}>
              Departments
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{
          background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <CardContent sx={{ p: 0 }}>
            {selectedTenant.departments.filter((d: any) => d.name !== 'Manager').length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="info">No departments found for this tenant</Alert>
              </Box>
            ) : (
              <Stack spacing={0}>
                {selectedTenant.departments
                  .filter((dept: any) => dept.name !== 'Manager')
                  .map((dept: any, index: number) => (
                    <DepartmentCard
                      key={index}
                      department={dept}
                      isLast={index === selectedTenant.departments.filter((d: any) => d.name !== 'Manager').length - 1}
                      onClick={() => handleDepartmentClick(dept.name)}
                    />
                  ))
                }
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        <Business />
        Tenant Details ({filteredTenants.length})
      </Typography>
      
      <SearchFilter 
        data={tenants}
        onFilter={setFilteredTenants}
        searchFields={[
          { key: 'tenantName', label: 'Tenant Name' }
        ]}
      />
      
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        mt: 3
      }}>
        <CardContent sx={{ p: 0 }}>
          {filteredTenants.length === 0 ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="info">
                {tenants.length === 0 ? 'No tenants found' : 'No tenants match your search'}
              </Alert>
            </Box>
          ) : (
            <Stack spacing={0}>
              {filteredTenants.map((tenant: any, index: number) => (
                <TenantCard
                  key={tenant.tenantId || index}
                  tenant={tenant}
                  isLast={index === filteredTenants.length - 1}
                  onClick={() => handleTenantClick(tenant)}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default TenantDetails;