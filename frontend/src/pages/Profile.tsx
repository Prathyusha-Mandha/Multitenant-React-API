import { Box, Card, CardContent, Container, CircularProgress, Typography } from '@mui/material';
import useProfile from '../hooks/useProfile';
import { ProfileHeader, ProfileAvatar, ProfileDetails } from '../components/profile';


function Profile() {
  const {
    userInfo,
    loading,
    updating,
    selectedFile,
    previewUrl,
    isEditing,
    editData,
    errors,
    handleFileChange,
    handlePhotoUpload,
    handleEditClick,
    handleSaveEdit,
    handleCancelEdit,
    handleEditDataChange,
    handleErrorClear
  } = useProfile();

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  if (errors.general) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error loading profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {errors.general}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No profile data available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unable to load user profile information.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'transparent' }}>
      <ProfileHeader />
      
      <Box sx={{ maxWidth: 800 }}>
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Image */}
            <Box sx={{ textAlign: 'left', mb: 4 }}>
              <ProfileAvatar
                userInfo={userInfo}
                previewUrl={previewUrl}
                selectedFile={selectedFile}
                errors={errors}
                updating={updating}
                onFileChange={handleFileChange}
                onPhotoUpload={handlePhotoUpload}
              />
            </Box>
            
            {/* Profile Details */}
            <ProfileDetails
              userInfo={userInfo}
              isEditing={isEditing}
              editData={editData}
              errors={errors}
              updating={updating}
              onEditClick={handleEditClick}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onEditDataChange={handleEditDataChange}
              onErrorClear={handleErrorClear}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Profile;