import { Box, Typography } from '@mui/material';
import { Business, People, Security } from '@mui/icons-material';

export default function RegisterSidebar() {
  return (
    <Box
      sx={{
        flex: { xs: 0, md: 0.4 },
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
        color: 'white',
        p: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3") center/cover',
          opacity: 0.1,
          zIndex: 0
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Join Our Platform
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
          Create your account and become part of our growing community
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Business sx={{ fontSize: 32, opacity: 0.8 }} />
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              Multi-tenant organization support
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <People sx={{ fontSize: 32, opacity: 0.8 }} />
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              Collaborative workspace
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Security sx={{ fontSize: 32, opacity: 0.8 }} />
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              Secure and reliable platform
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}