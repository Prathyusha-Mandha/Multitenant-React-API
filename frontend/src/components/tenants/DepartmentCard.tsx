import { Box, Typography, Divider, Chip } from '@mui/material';
import { Group, ArrowForward } from '@mui/icons-material';

interface DepartmentCardProps {
  department: any;
  isLast: boolean;
  onClick: () => void;
}

export default function DepartmentCard({ department, isLast, onClick }: DepartmentCardProps) {
  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          p: 3,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            transform: 'translateX(8px)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Group sx={{ color: '#1976d2', fontSize: 24 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {department.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {department.userCount || 0} users
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${department.userCount || 0} Users`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <ArrowForward sx={{ color: '#1976d2' }} />
        </Box>
      </Box>
      {!isLast && <Divider />}
    </>
  );
}