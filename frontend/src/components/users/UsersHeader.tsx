import { Box} from '@mui/material';
import { People } from '@mui/icons-material';

export default function UsersHeader() {
  return (
    <Box sx={{ mb: 4, borderLeft: '4px solid #1976d2', pl: 3 }}>
      <h4 style={{
        color: '#FFFFFF',
        fontWeight: 600,
        marginBottom: '4px',
        letterSpacing: '0.5px',
        textShadow: '2px 2px 6px rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '2.125rem',
        lineHeight: '1.235',
        margin: '0 0 4px 0',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }}>
        <People style={{ color: '#FFFFFF', fill: '#FFFFFF', fontSize: '1.5rem' }} />
        User Management
      </h4>
      <p style={{
        color: '#FFFFFF',
        fontStyle: 'italic',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: '1.5',
        margin: 0,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }}>
        Browse users by department and manage user access • 3 departments
      </p>
    </Box>
  );
}