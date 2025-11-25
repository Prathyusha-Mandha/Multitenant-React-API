import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Reply } from '@mui/icons-material';

interface PostCardProps {
  post: any;
  onPostClick: (post: any) => void;
}

export default function PostCard({ post, onPostClick }: PostCardProps) {
  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }} onClick={() => onPostClick(post)}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
          {post.userName || 'Post'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          {post.description || 'No content'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#999' }}>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Reply sx={{ fontSize: 16, color: '#1976d2' }} />
              <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600 }}>
                {post.responseMessages?.length || 0} replies
              </Typography>
            </Box>
            <Chip label={post.department || 'General'} size="small" color="primary" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}