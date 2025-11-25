import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  Button,
  CircularProgress,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Send,
  AttachFile,
  ExpandMore,
  ExpandLess,
  Download,
  Reply,
  PostAdd
} from '@mui/icons-material';
import { postService, adminService } from '../services';

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  fileError: string;
  setFileError: (error: string) => void;
}

const FileUpload = ({ selectedFile, onFileSelect, fileError, setFileError }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed');
      onFileSelect(null);
    } else {
      setFileError('');
      onFileSelect(file);
    }
  };

  return (
    <Box>
      <Button
        component="label"
        variant="outlined"
        startIcon={<AttachFile />}
        sx={{ mb: 1 }}
      >
        Attach File (Optional)
        <input
          type="file"
          hidden
          accept=".pdf"
          onChange={handleFileChange}
        />
      </Button>
      {fileError && (
        <Typography variant="body2" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
          {fileError}
        </Typography>
      )}
      {selectedFile && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Selected: {selectedFile.name}
        </Typography>
      )}
    </Box>
  );
};

interface ReplyFormProps {
  postId: string;
  show: boolean;
  replyText: string;
  onReplyChange: (postId: string, text: string) => void;
  onFileChange: (postId: string, file: File | null) => void;
  onSubmit: (postId: string) => void;
  fileError?: string;
}

export const ReplyForm = ({ 
  postId, 
  show, 
  replyText, 
  onReplyChange, 
  onSubmit, 
  fileError 
}: ReplyFormProps) => (
  <Collapse in={show}>
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Write a reply..."
        value={replyText}
        onChange={(e) => onReplyChange(postId, e.target.value)}
        sx={{ mb: 2 }}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => onSubmit(postId)}
        >
          Reply
        </Button>
      </Stack>
      {fileError && (
        <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
          {fileError}
        </Typography>
      )}
    </Box>
  </Collapse>
);

// Post Card Component
interface PostCardProps {
  post: any;
  onPostClick: (post: any) => void;
  expanded?: boolean;
}

export const PostCard = ({ post, onPostClick, expanded = false }: PostCardProps) => (
  <Card sx={{
    background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
    }
  }}>
    <CardContent sx={{ cursor: 'pointer', p: 3 }} onClick={() => onPostClick(post)}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
            By {post.userName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
            {post.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
              {post.department}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={`${post.replyCount} replies`} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(25, 118, 210, 0.1)', 
              color: '#1976d2',
              fontWeight: 600
            }} 
          />
          <IconButton size="small" sx={{ color: '#1976d2' }}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface CreatePostFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreatePostForm = ({ onSuccess, onCancel }: CreatePostFormProps) => {
  const [newPost, setNewPost] = useState({ description: '', department: 'All' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tenantDepartments, setTenantDepartments] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ description: '' });
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    fetchTenantDepartments();
  }, []);

  const fetchTenantDepartments = async () => {
    try {
      const tenantNames = await adminService.getTenantNames();
      if (tenantNames.length === 0) {
        setTenantDepartments(['All']);
        return;
      }
      
      // Use only the first tenant to avoid multiple calls
      const departments = await adminService.getTenantDepartmentsByName(tenantNames[0]);
      const uniqueDepartments = [...new Set(departments)].filter(
        (dept: string) => dept && dept !== 'None' && dept.trim() !== ''
      );
      
      setTenantDepartments(['All', ...uniqueDepartments]);
    } catch (error) {
      setTenantDepartments(['All']);
    }
  };

  const validateForm = () => {
    const newErrors = { description: '' };
    
    if (!newPost.description.trim()) {
      newErrors.description = 'Message is required';
    } else if (newPost.description.length > 1000) {
      newErrors.description = 'Message must not exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return !newErrors.description;
  };

  const handleCreatePost = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const postData = {
        ...newPost,
        description: newPost.description.trim(),
        file: selectedFile || undefined
      };
      await postService.createPostMessage(postData);
      setNewPost({ description: '', department: 'All' });
      setSelectedFile(null);
      setErrors({ description: '' });
      onSuccess();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            select
            fullWidth
            label="Department"
            value={newPost.department}
            onChange={(e) => setNewPost(prev => ({ ...prev, department: e.target.value }))}
          >
            {tenantDepartments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Message"
            placeholder="What's on your mind?"
            value={newPost.description}
            onChange={(e) => {
              setNewPost(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            error={!!errors.description}
            helperText={errors.description || `${newPost.description.length}/1000 characters`}
          />
          
          <FileUpload
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            fileError={fileError}
            setFileError={setFileError}
          />
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <Send />}
              onClick={handleCreatePost}
              disabled={loading || !newPost.description.trim() || !!errors.description}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              {loading ? 'Posting...' : 'Post Message'}
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

interface PostsHeaderProps {
  onCreatePost: () => void;
}

export const PostsHeader = ({ onCreatePost }: PostsHeaderProps) => (
  <Card sx={{
    background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    mb: 3
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ 
          color: '#1976d2', 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<PostAdd />}
          onClick={onCreatePost}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
            }
          }}
        >
          Create Post
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export const EmptyState = () => (
  <Card sx={{
    background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.95) 0%, rgba(187, 222, 251, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
    p: 6
  }}>
    <PostAdd sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
    <Typography variant="h5" sx={{ color: '#1976d2', mb: 2, fontWeight: 600 }}>
      No posts yet
    </Typography>
    <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
      Be the first to share something with your team!
    </Typography>
  </Card>
);

interface ReplyListProps {
  replies: any[];
  onDownloadFile: (responseMessageId: string, fileName: string) => void;
}

export const ReplyList = ({ replies, onDownloadFile }: ReplyListProps) => (
  <Box sx={{ mt: 2 }}>
    {replies.map((reply: any) => (
      <Card key={reply.responseMessageId} sx={{
        mb: 2,
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                {reply.userName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                {reply.replyText}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Download />}
                onClick={() => onDownloadFile(reply.responseMessageId, reply.fileName || 'attachment')}
                sx={{
                  mt: 1,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {reply.fileName || 'Download File'}
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: '#666', ml: 2 }}>
              {new Date(reply.createdAt).toLocaleDateString()} • {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

interface PostDetailProps {
  post: any;
  onBack: () => void;
  onReply: (postId: string) => void;
  onDownloadFile: (postId: string, fileName: string) => void;
  onDownloadReplyFile: (responseMessageId: string, fileName: string) => void;
}

export const PostDetail = ({ post, onBack, onReply, onDownloadFile, onDownloadReplyFile }: PostDetailProps) => (
  <Box>
    <Button
      startIcon={<ExpandLess />}
      onClick={onBack}
      sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}
    >
      Back to Posts
    </Button>
    
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      mb: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>
          By {post.userName}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#333', lineHeight: 1.6 }}>
          {post.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip label={post.department} size="small" color="primary" />
            <Typography variant="caption" sx={{ color: '#666' }}>
              {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Reply />}
            onClick={() => onReply(post.postMessageId)}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Reply
          </Button>
        </Box>
        
        {post.fileUrl && (
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => onDownloadFile(post.postMessageId, post.fileName)}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {post.fileName || 'Download Attachment'}
          </Button>
        )}
      </CardContent>
    </Card>
    
    {post.replies && post.replies.length > 0 && (
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>
            Replies ({post.replies.length})
          </Typography>
          <ReplyList replies={post.replies} onDownloadFile={onDownloadReplyFile} />
        </CardContent>
      </Card>
    )}
  </Box>
);