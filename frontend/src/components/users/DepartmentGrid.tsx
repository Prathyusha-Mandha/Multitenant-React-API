import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { Group, ArrowForward } from '@mui/icons-material';

interface DepartmentGridProps {
  departments: any[];
  onDepartmentClick: (departmentName: string) => void;
}

export default function DepartmentGrid({ departments, onDepartmentClick }: DepartmentGridProps) {
  return (
    <Box sx={{ mt: 3 }}>

      {departments.length === 0 ? (
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
            No Departments Found
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No departments are available at this time.
          </Typography>
        </Card>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: { xs: 2, sm: 3 }
        }}>
          {departments.map((department, index) => (
            <Box key={index}>
              <Card
                onClick={() => onDepartmentClick(department.name)}
                sx={{
                  background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0 }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1.5, sm: 2 },
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Group sx={{ 
                        color: '#1976d2', 
                        fontSize: { xs: 28, sm: 32 } 
                      }} />
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: '#1976d2',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        wordBreak: 'break-word'
                      }}>
                        {department.name}
                      </Typography>
                    </Box>
                    <ArrowForward sx={{ 
                      color: '#1976d2',
                      alignSelf: { xs: 'center', sm: 'flex-start' }
                    }} />
                  </Box>

                  <Typography variant="body2" sx={{ 
                    color: '#666', 
                    mb: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    flex: 1
                  }}>
                    {department.description || 'Department users and information'}
                  </Typography>

                  <Chip 
                    label={`${department.userCount || 0} Users`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
                  />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}