import { Box, Typography, Divider, Chip } from '@mui/material';
import { Business, Person, Group } from '@mui/icons-material';

interface TenantCardProps {
  tenant: any;
  isLast: boolean;
  onClick: () => void;
}

export default function TenantCard({ tenant, isLast, onClick }: TenantCardProps) {
  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          p: 3,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            transform: 'translateX(8px)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Business sx={{ color: '#1976d2', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {tenant.tenantName}
            </Typography>
          </Box>
          <Chip 
            label={`${tenant.departments?.length || 0} Departments`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>

        {tenant.managerName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Person sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              Manager: {tenant.managerName}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Group sx={{ fontSize: 16, color: '#666' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {tenant.departments?.reduce((total: number, dept: any) => total + (dept.userCount || 0), 0) || 0} Total Users
          </Typography>
        </Box>
      </Box>
      {!isLast && <Divider />}
    </>
  );
}