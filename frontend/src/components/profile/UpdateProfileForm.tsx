import { Box, TextField, Button, Avatar, Typography, Card, CardContent } from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';

interface UpdateProfileFormProps {
  formData: any;
  previewUrl: string;
  updating: boolean;
  onInputChange: (field: string, value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UpdateProfileForm({
  formData,
  previewUrl,
  updating,
  onInputChange,
  onFileChange,
  onSubmit
}: UpdateProfileFormProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <Card sx={{
      maxWidth: 600,
      mx: 'auto',
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mb: 3, textAlign: 'center' }}>
          Update Profile
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              src={previewUrl || formData.profilePicture}
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                fontSize: 40,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
              }}
            >
              {formData.userName?.charAt(0)?.toUpperCase()}
            </Avatar>
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ borderRadius: 2 }}
            >
              Change Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Full Name"
            value={formData.userName}
            onChange={(e) => onInputChange('userName', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Department"
            value={formData.department}
            onChange={(e) => onInputChange('department', e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<Save />}
            disabled={updating}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              }
            }}
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}