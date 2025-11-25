import { Box, TextField, Button, MenuItem, Alert, Typography, Link } from '@mui/material';


interface RegisterFormProps {
  formData: any;
  errors: any;
  loading: boolean;
  successMessage: string;
  companies: any[];
  availableDepartments: any[];
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function RegisterForm({
  formData,
  errors,
  loading,
  successMessage,
  companies,
  availableDepartments,
  onInputChange,
  onSubmit,
  onBack
}: RegisterFormProps) {
  return (
    <Box component="form" onSubmit={onSubmit}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Full Name"
        value={formData.userName}
        onChange={(e) => onInputChange('userName', e.target.value)}
        error={!!errors.userName}
        helperText={errors.userName}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => onInputChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => onInputChange('password', e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        select
        label="Company"
        value={formData.tenantId}
        onChange={(e) => onInputChange('tenantId', e.target.value)}
        error={!!errors.tenantId}
        helperText={errors.tenantId}
        sx={{ mb: 2 }}
      >
        {companies.map((company) => (
          <MenuItem key={company.tenantId} value={company.tenantId}>
            {company.tenantName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Department"
        value={formData.departmentName}
        onChange={(e) => onInputChange('departmentName', e.target.value)}
        error={!!errors.departmentName}
        helperText={errors.departmentName}
        sx={{ mb: 3 }}
      >
        {availableDepartments.map((dept) => (
          <MenuItem key={dept} value={dept}>
            {dept}
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
          },
          mb: 2
        }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={onBack}
            sx={{
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}