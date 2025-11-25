import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, Create } from '@mui/icons-material';

interface CreatePostHeaderProps {
  onBack: () => void;
}

export default function CreatePostHeader({ onBack }: CreatePostHeaderProps) {
  return (
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton 
        onClick={onBack}
        sx={{ 
          color: '#ffffff',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
        }}
      >
        <ArrowBack />
      </IconButton>
      
      <Box sx={{ borderLeft: '4px solid #1976d2', pl: 3 }}>
        <Typography variant="h4" sx={{
          color: '#ffffff',
          fontWeight: 600,
          mb: 0.5,
          letterSpacing: '0.5px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Create />
          Create New Post
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#ffffff',
          fontStyle: 'italic',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
        }}>
          Share your thoughts with the community
        </Typography>
      </Box>
    </Box>
  );
}