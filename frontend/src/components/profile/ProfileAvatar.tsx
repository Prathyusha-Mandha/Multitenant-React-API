import { Box, Avatar, Button, Typography, Alert } from '@mui/material';
import { PhotoCamera, Upload } from '@mui/icons-material';

interface ProfileAvatarProps {
  userInfo: any;
  previewUrl: string;
  selectedFile: File | null;
  errors: any;
  updating: boolean;
  onFileChange: (file: File | null) => void;
  onPhotoUpload: () => void;
}

export default function ProfileAvatar({ 
  userInfo, 
  previewUrl, 
  selectedFile, 
  errors, 
  updating, 
  onFileChange, 
  onPhotoUpload 
}: ProfileAvatarProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  const getProfileImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (userInfo?.profilePicture) {
      if (userInfo.profilePicture.startsWith('data:image/') || userInfo.profilePicture.startsWith('/9j/')) {
        return userInfo.profilePicture.startsWith('data:image/') 
          ? userInfo.profilePicture 
          : `data:image/jpeg;base64,${userInfo.profilePicture}`;
      }
      if (userInfo.profilePicture.startsWith('http')) {
        return userInfo.profilePicture;
      }
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7198';
      return `${apiBaseUrl}${userInfo.profilePicture.startsWith('/') ? '' : '/'}${userInfo.profilePicture}`;
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={getProfileImageUrl()}
          sx={{
            width: 120,
            height: 120,
            fontSize: 48,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            border: '4px solid white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          {userInfo?.userName?.charAt(0)?.toUpperCase()}
        </Avatar>
        
        <Button
          variant="contained"
          component="label"
          size="small"
          sx={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          <PhotoCamera sx={{ fontSize: 20 }} />
          <input
            type="file"
            hidden
            accept=".jpg,.jpeg,image/jpeg"
            onChange={handleFileSelect}
          />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#000000' }}>
          {userInfo?.userName}
        </Typography>
        
        {selectedFile && (
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={onPhotoUpload}
            disabled={updating}
            sx={{ borderRadius: 2, alignSelf: 'flex-start' }}
          >
            {updating ? 'Uploading...' : 'Upload'}
          </Button>
        )}

        {errors.photo && (
          <Alert severity="error" sx={{ maxWidth: 300 }}>
            {errors.photo}
          </Alert>
        )}
      </Box>
    </Box>
  );
}