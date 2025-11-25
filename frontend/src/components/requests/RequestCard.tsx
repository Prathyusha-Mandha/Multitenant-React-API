import { Card, CardContent, Typography, Box, Chip, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Person, Email, Business, CheckCircle, Cancel } from '@mui/icons-material';
import { useState } from 'react';

interface RequestCardProps {
  request: any;
  updating: boolean;
  onStatusUpdate: (requestId: string, status: string) => void;
}

export default function RequestCard({ request, updating, onStatusUpdate }: RequestCardProps) {
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', requestId: '' });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return '#4caf50';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#2196f3';
    }
  };

  const handleConfirm = () => {
    onStatusUpdate(confirmDialog.requestId, confirmDialog.action);
    setConfirmDialog({ open: false, action: '', requestId: '' });
  };

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            {request.userName || 'Unknown User'}
          </Typography>
          <Chip 
            label={request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase() : 'Pending'} 
            size="small" 
            sx={{ 
              backgroundColor: getStatusColor(request.status),
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Email sx={{ fontSize: 16, color: '#666' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {request.email || 'No email'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Person sx={{ fontSize: 16, color: '#666' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {request.role || 'No role specified'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Business sx={{ fontSize: 16, color: '#666' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {request.companyName || request.tenantName || 'No company'}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 2 }}>
          Requested: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown date'}
        </Typography>

        {(!request.status || request.status.toLowerCase() === 'pending') && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle />}
                onClick={() => setConfirmDialog({ open: true, action: 'Approved', requestId: request.registrationId || request.id })}
                disabled={updating}
                sx={{ flex: 1, borderRadius: 2 }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Cancel />}
                onClick={() => setConfirmDialog({ open: true, action: 'Rejected', requestId: request.registrationId || request.id })}
                disabled={updating}
                sx={{ flex: 1, borderRadius: 2 }}
              >
                Reject
              </Button>
            </Box>
          </>
        )}
      </CardContent>
      
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', requestId: '' })}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action === 'Approved' ? 'approve' : 'reject'} this request for {request.userName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', requestId: '' })}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color={confirmDialog.action === 'Approved' ? 'success' : 'error'}>
            {confirmDialog.action === 'Approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}