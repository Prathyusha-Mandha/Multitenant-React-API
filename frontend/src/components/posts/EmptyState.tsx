import { Box, Typography, Card, Button } from '@mui/material';
import { Article, Add } from '@mui/icons-material';

interface EmptyStateProps {
  isMyPosts: boolean;
}

export default function EmptyState({ isMyPosts }: EmptyStateProps) {
  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      textAlign: 'center',
      p: 6
    }}>
      <Box sx={{ mb: 2, color: '#1976d2' }}>
        <Article sx={{ fontSize: 64 }} />
      </Box>
      <Typography variant="h5" sx={{ color: '#1976d2', mb: 2, fontWeight: 600 }}>
        {isMyPosts ? 'No Posts Yet' : 'No Posts Available'}
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
        {isMyPosts 
          ? "You haven't created any posts yet. Start sharing your thoughts!"
          : "No posts have been shared yet. Be the first to create one!"
        }
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        Create First Post
      </Button>
    </Card>
  );
}