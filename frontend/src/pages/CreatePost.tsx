import { Box } from '@mui/material';
import CreatePostHeader from '../components/posts/CreatePostHeader';
import { CreatePostForm } from '../components/Posts';

interface CreatePostProps {
  onBack: () => void;
}

function CreatePost({ onBack }: CreatePostProps) {
  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'transparent' }}>
      <CreatePostHeader onBack={onBack} />
      
      <Box sx={{ maxWidth: 800 }}>
        <CreatePostForm 
          onSuccess={onBack}
          onCancel={onBack}
        />
      </Box>
    </Box>
  );
}

export default CreatePost;