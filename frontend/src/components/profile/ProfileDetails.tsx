import { Box, TextField, Button, Chip, Alert, Typography, Card, Divider, Avatar } from '@mui/material';
import { Edit, Save, Cancel, Person, Email, Business, Badge } from '@mui/icons-material';

interface ProfileDetailsProps {
  userInfo: any;
  isEditing: boolean;
  editData: any;
  errors: any;
  updating: boolean;
  onEditClick: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditDataChange: (field: string, value: string) => void;
  onErrorClear: () => void;
}

export default function ProfileDetails({
  userInfo,
  isEditing,
  editData,
  errors,
  updating,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onEditDataChange
}: ProfileDetailsProps) {
  const isAdmin = userInfo?.role === 'Admin';
  const isManager = userInfo?.role === 'Manager';
  const isDeptManager = userInfo?.role === 'DeptManager';
  const isEmployee = userInfo?.role === 'Employee';
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '#f44336';
      case 'manager': return '#ff9800';
      case 'deptmanager': return '#9c27b0';
      case 'employee': return '#4caf50';
      default: return '#2196f3';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600 }}>
          Profile Information
        </Typography>
        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onEditClick}
            sx={{ borderRadius: 3 }}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={onSaveEdit}
              disabled={updating}
              color="success"
              sx={{ borderRadius: 3 }}
            >
              {updating ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onCancelEdit}
              disabled={updating}
              color="error"
              sx={{ borderRadius: 3 }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      {isEditing ? (
        <Box>
          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>User ID</Typography>
              <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.userId}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={editData.userName}
                onChange={(e) => onEditDataChange('userName', e.target.value)}
                error={!!errors.userName}
                helperText={errors.userName}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Email Address"
                value={editData.email}
                onChange={(e) => onEditDataChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Role</Typography>
              <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.role}</Typography>
            </Box>
          </Box>
          
          {(isManager || isDeptManager || isEmployee) && (
            <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Tenant ID</Typography>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.tenantId}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Tenant Name</Typography>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.tenantName}</Typography>
              </Box>
            </Box>
          )}
          
          {(isDeptManager || isEmployee) && (
            <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Department</Typography>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.department || userInfo?.departmentName}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}></Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>User ID</Typography>
              <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.userId}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Full Name</Typography>
              <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.userName}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Email Address</Typography>
              <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.email}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Role</Typography>
              <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.role}</Typography>
            </Box>
          </Box>
          
          {(isManager || isDeptManager || isEmployee) && (
            <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Tenant ID</Typography>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.tenantId}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Tenant Name</Typography>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.tenantName}</Typography>
              </Box>
            </Box>
          )}
          
          {(isDeptManager || isEmployee) && (
            <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>Department</Typography>
                <Typography variant="body1" sx={{ color: '#000', fontWeight: 600 }}>{userInfo?.department || userInfo?.departmentName}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}></Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}