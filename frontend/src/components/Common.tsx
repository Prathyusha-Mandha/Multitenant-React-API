import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  TextField,
  MenuItem,
  IconButton,
  Container,
  Avatar
} from '@mui/material';
import {
  Login,
  PersonAdd,
  Person,
  Business,
  Assignment,
  Notifications,
  People,
  Chat,
  Article,
  Logout,
  Settings,
  Search,
  Edit
} from '@mui/icons-material';
import { APP_CONFIG, ROLE_MENUS, UI_TEXT } from '../services/constants';
import type { NavbarProps, SidebarProps } from '../services/types';

// Navbar Component
export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => (
  <AppBar position="fixed">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        Multitenant Portal
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          color="inherit"
          variant={currentView === 'login' ? 'contained' : 'outlined'}
          startIcon={<Login />}
          onClick={() => onViewChange('login')}
          sx={{ 
            bgcolor: currentView === 'login' ? 'rgba(255,255,255,0.2)' : 'transparent',
            borderColor: 'rgba(255,255,255,0.5)'
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Login
          </Box>
        </Button>
        <Button 
          color="inherit"
          variant={currentView === 'register' ? 'contained' : 'outlined'}
          startIcon={<PersonAdd />}
          onClick={() => onViewChange('register')}
          sx={{ 
            bgcolor: currentView === 'register' ? 'rgba(255,255,255,0.2)' : 'transparent',
            borderColor: 'rgba(255,255,255,0.5)'
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Register
          </Box>
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

// Sidebar Content Component
const SidebarContent = ({ userRole, currentView, onViewChange, onClose }: {
  userRole: string;
  currentView: string;
  onViewChange: (view: string) => void;
  onClose?: () => void;
}) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  
  const getMenuItems = () => {
    const iconMap = {
      Profile: <Person />,
      TenantDetails: <Business />,
      Requests: <Assignment />,
      Notifications: <Notifications />,
      UserDetails: <People />,
      Chats: <Chat />,
      Posts: <Article />
    };

    const menuItems = ROLE_MENUS[userRole as keyof typeof ROLE_MENUS] || [];
    return menuItems.map(item => ({
      ...item,
      icon: iconMap[item.key as keyof typeof iconMap]
    }));
  };

  return (
    <>
      <Box sx={{ 
        textAlign: 'center', 
        py: { xs: 2, md: 4 }, 
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{
          display: 'inline-flex',
          p: { xs: 1, md: 2 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          mb: 2,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
        }}>
          <Settings sx={{ fontSize: { xs: 24, md: 32 }, color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {APP_CONFIG.APP_NAME}
        </Typography>
      </Box>
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <List sx={{ '& .MuiListItem-root': { mb: 1.5 } }}>
          {getMenuItems().map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={currentView === item.key}
                onClick={() => {
                  onViewChange(item.key);
                  onClose?.();
                }}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&.Mui-selected': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    transform: 'translateX(8px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateX(12px)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'white', 
                  minWidth: 45,
                  '& .MuiSvgIcon-root': {
                    fontSize: 22,
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                  }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ 
          my: 3, 
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          height: 2,
          borderRadius: 1
        }} />
        
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 4,
              py: 1.5,
              px: 3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(211, 47, 47, 0.9) 50%, rgba(183, 28, 28, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.95) 0%, rgba(183, 28, 28, 0.95) 50%, rgba(136, 14, 79, 0.95) 100%)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(244, 67, 54, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: 'white', 
              minWidth: 50,
              '& .MuiSvgIcon-root': {
                fontSize: 26,
                filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))',
              }
            }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary={UI_TEXT.LOGOUT}
              primaryTypographyProps={{
                fontWeight: 800,
                fontSize: '1.1rem',
                color: 'white',
                letterSpacing: '0.5px'
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </>
  );
};

// Sidebar Component
export const Sidebar = ({ userRole, currentView, onViewChange, isOpen = false, isMobile = false, onClose }: SidebarProps) => (
  <>
    {!isMobile && (
      <Drawer
        variant="permanent"
        sx={{
          width: APP_CONFIG.SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: APP_CONFIG.SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #3498db 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRight: '2px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            height: '100vh',
            top: 0,
            left: 0
          },
        }}
      >
        <SidebarContent 
          userRole={userRole}
          currentView={currentView}
          onViewChange={onViewChange}
          onClose={onClose}
        />
      </Drawer>
    )}

    {isMobile && (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: APP_CONFIG.SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #3498db 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            color: 'white',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <SidebarContent 
          userRole={userRole}
          currentView={currentView}
          onViewChange={onViewChange}
          onClose={onClose}
        />
      </Drawer>
    )}
  </>
);

// Split Layout Component
interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftPanelProps?: any;
  rightPanelProps?: any;
}

export const SplitLayout = ({ leftPanel, rightPanel, leftPanelProps = {}, rightPanelProps = {} }: SplitLayoutProps) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Box sx={{ 
      flex: 1, 
      position: 'relative',
      overflow: 'hidden',
      ...leftPanelProps 
    }}>
      {leftPanel}
    </Box>
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: 3,
      ...rightPanelProps 
    }}>
      {rightPanel}
    </Box>
  </Box>
);

// Search Filter Component
interface SearchFilterProps {
  data: any[];
  onFilter: (filtered: any[]) => void;
  searchFields: { key: string; label: string }[];
}

export const SearchFilter = ({ data, onFilter, searchFields }: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState(searchFields[0]?.key || '');

  useEffect(() => {
    if (!searchTerm.trim()) {
      onFilter(data);
      return;
    }

    const filtered = data.filter(item => {
      const value = item[selectedField];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    onFilter(filtered);
  }, [searchTerm, selectedField]);

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: { xs: 1, sm: 2 }, 
      mb: 2,
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      <TextField
        select
        size="small"
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        sx={{ 
          minWidth: { xs: '100%', sm: 120 },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '& fieldset': {
              borderColor: 'rgba(25, 118, 210, 0.3)'
            },
            '&:hover fieldset': {
              borderColor: '#1976d2'
            }
          }
        }}
      >
        {searchFields.map(field => (
          <MenuItem key={field.key} value={field.key}>
            {field.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        placeholder={`Search by ${searchFields.find(f => f.key === selectedField)?.label || 'field'}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
          flex: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '& fieldset': {
              borderColor: 'rgba(25, 118, 210, 0.3)'
            },
            '&:hover fieldset': {
              borderColor: '#1976d2'
            }
          }
        }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />
    </Box>
  );
};

// Animated Card Component
interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  hover?: boolean;
}

export const AnimatedCard = ({ children, delay = 0, hover = true }: AnimatedCardProps) => (
  <Card sx={{
    background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    animationDelay: `${delay}ms`,
    ...(hover && {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
      }
    })
  }}>
    {children}
  </Card>
);

// Form Field Component
interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  children?: React.ReactNode;
}

export const FormField = ({ 
  name, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required, 
  error, 
  multiline,
  rows,
  select,
  children 
}: FormFieldProps) => (
  <TextField
    name={name}
    label={label}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    error={!!error}
    helperText={error}
    fullWidth
    multiline={multiline}
    rows={rows}
    select={select}
    sx={{ mb: 2 }}
  >
    {children}
  </TextField>
);

// Gradient Button Component
interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const GradientButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled, 
  variant = 'primary',
  size = 'medium',
  fullWidth,
  startIcon,
  endIcon
}: GradientButtonProps) => {
  const getGradient = () => {
    switch (variant) {
      case 'secondary':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      default:
        return 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)';
    }
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        background: getGradient(),
        color: 'white',
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        py: size === 'large' ? 1.5 : size === 'small' ? 0.75 : 1,
        px: size === 'large' ? 4 : size === 'small' ? 2 : 3,
        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
        '&:hover': {
          background: variant === 'secondary' 
            ? 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)'
            : 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
          transform: 'translateY(-1px)'
        },
        '&:disabled': {
          background: 'rgba(0, 0, 0, 0.12)',
          boxShadow: 'none',
          transform: 'none'
        }
      }}
    >
      {children}
    </Button>
  );
};

// Profile Avatar Component
interface ProfileAvatarProps {
  src?: string;
  name: string;
  size?: number;
  editable?: boolean;
  onEdit?: () => void;
}

export const ProfileAvatar = ({ src, name, size = 120, editable, onEdit }: ProfileAvatarProps) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <Avatar
      src={src}
      sx={{
        width: size,
        height: size,
        fontSize: size / 3,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        border: '4px solid white',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
    {editable && (
      <IconButton
        onClick={onEdit}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          width: 32,
          height: 32,
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
          }
        }}
      >
        <Edit sx={{ fontSize: 16 }} />
      </IconButton>
    )}
  </Box>
);

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Card sx={{
    background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.95) 0%, rgba(187, 222, 251, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
    p: { xs: 4, sm: 6 }
  }}>
    <Box sx={{ mb: 2, color: '#1976d2' }}>
      {icon}
    </Box>
    <Typography variant="h5" sx={{ 
      color: '#1976d2', 
      mb: 2, 
      fontWeight: 600,
      fontSize: { xs: '1.25rem', sm: '1.5rem' }
    }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ 
      color: '#666', 
      mb: 3,
      fontSize: { xs: '0.9rem', sm: '1rem' }
    }}>
      {description}
    </Typography>
    {action}
  </Card>
);

// Loading Component
export const Loading = ({ message = 'Loading...' }: { message?: string }) => (
  <Container sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ 
      width: 40, 
      height: 40, 
      border: '4px solid #e3f2fd',
      borderTop: '4px solid #1976d2',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      mb: 2
    }} />
    <Typography variant="body1" sx={{ color: '#666' }}>
      {message}
    </Typography>
  </Container>
);