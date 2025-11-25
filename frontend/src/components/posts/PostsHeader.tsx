import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { Article, Add } from '@mui/icons-material';

interface PostsHeaderProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  onCreatePost: () => void;
}

export default function PostsHeader({ activeTab, onTabChange, onCreatePost }: PostsHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
            <Article />
            Posts
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#ffffff',
            fontStyle: 'italic',
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
          }}>
            Share and discover content from your community
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreatePost}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Create Post
        </Button>
      </Box>

      <Box sx={{
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
        borderRadius: 2,
        p: 1,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, value) => onTabChange(value)}
          sx={{
            '& .MuiTab-root': {
              color: '#e5e7eb',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48
            },
            '& .Mui-selected': {
              color: '#ffffff !important',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 1
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'transparent'
            }
          }}
        >
          <Tab label="All Posts" />
          <Tab label="My Posts" />
        </Tabs>
      </Box>
    </Box>
  );
}