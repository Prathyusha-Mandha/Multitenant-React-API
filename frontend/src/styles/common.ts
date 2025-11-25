export const commonStyles = {
  // Layout styles
  splitLayout: {
    display: 'flex',
    minHeight: '100vh',
  },
  
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    p: 4,
  },
  
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
    bgcolor: '#f8f9fa',
  },

  // Card styles
  cardStyle: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: 3,
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover': { 
      backgroundColor: 'rgba(25, 118, 210, 0.08)', 
      transform: 'scale(1.01)' 
    },
  },

  // Header styles
  headerStyle: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontWeight: 700,
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    '& svg': { fontSize: 32 }
  },

  // Avatar styles
  avatarStyle: {
    width: 45,
    height: 45,
    bgcolor: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
  },

  // Button styles
  primaryButton: {
    py: 1.5,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
    }
  },

  // Form styles
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },

  // Loading styles
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },

  // Dashboard styles
  dashboardHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  tabPanel: {
    p: 3,
    minHeight: 'calc(100vh - 200px)',
  },

  // Empty state styles
  emptyState: {
    textAlign: 'center',
    p: 6,
    color: '#666',
  },
};