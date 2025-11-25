import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Person, 
  Assignment, 
  Notifications, 
  Business, 
  Logout,
  People,
  PostAdd,
  Menu as MenuIcon
} from '@mui/icons-material';
import { STORAGE_KEYS } from '../services/constants';
import Profile from './Profile';
import Requests from './Requests';
import NotificationsPage from './Notifications';
import TenantDetails from './TenantDetails';
import UserDetails from './UserDetails';

import Posts from './Posts';

const SIDEBAR_WIDTH = 300;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE) || '';
    const name = localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'User';
    setUserRole(role);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getTabsForRole = () => {
    const baseTabs = [
      { label: 'Profile', icon: <Person />, component: <Profile /> }
    ];

    switch (userRole) {
      case 'Admin':
        return [
          ...baseTabs,
          { label: 'Requests', icon: <Assignment />, component: <Requests /> },
          { label: 'Notifications', icon: <Notifications />, component: <NotificationsPage /> },
          { label: 'Tenants', icon: <Business />, component: <TenantDetails /> }
        ];
      
      case 'Manager':
        return [
          ...baseTabs,
          { label: 'Requests', icon: <Assignment />, component: <Requests /> },
          { label: 'Users', icon: <People />, component: <UserDetails /> },
          { label: 'Posts', icon: <PostAdd />, component: <Posts /> },
          { label: 'Notifications', icon: <Notifications />, component: <NotificationsPage /> }
        ];
      
      case 'DeptManager':
        return [
          ...baseTabs,
          { label: 'Requests', icon: <Assignment />, component: <Requests /> },
          { label: 'Users', icon: <People />, component: <UserDetails /> },
          { label: 'Posts', icon: <PostAdd />, component: <Posts /> },
          { label: 'Notifications', icon: <Notifications />, component: <NotificationsPage /> }
        ];
      
      case 'Employee':
        return [
          ...baseTabs,
          { label: 'Posts', icon: <PostAdd />, component: <Posts /> },
          { label: 'Notifications', icon: <Notifications />, component: <NotificationsPage /> }
        ];
      
      default:
        return baseTabs;
    }
  };

  const tabs = getTabsForRole();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h5" sx={{ 
          color: 'white', 
          fontWeight: 700,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '0.5px'
        }}>
          Dashboard
        </Typography>
        <Typography variant="caption" sx={{ 
          color: '#d1d5db', 
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {userRole}
        </Typography>
      </Box>
      
      <List sx={{ pt: 3, px: 1 }}>
        {tabs.map((tab, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === index}
              onClick={() => {
                setActiveTab(index);
                localStorage.setItem('activeTab', index.toString());
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(107, 114, 128, 0.15) 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: 'linear-gradient(to bottom, #9ca3af, #6b7280)',
                    borderRadius: '0 2px 2px 0'
                  },
                  '&:hover': { 
                    background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.25) 0%, rgba(107, 114, 128, 0.2) 100%)',
                    transform: 'translateX(6px)'
                  }
                },
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  transform: 'translateX(2px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                },
                py: 1.5,
                px: 2
              }}
            >
              <ListItemIcon sx={{ 
                color: activeTab === index ? '#f3f4f6' : '#d1d5db', 
                minWidth: 40,
                transition: 'all 0.3s ease',
                '& svg': {
                  fontSize: 22,
                  filter: activeTab === index ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                }
              }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText 
                primary={tab.label} 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: activeTab === index ? 600 : 500,
                    fontSize: '0.95rem',
                    color: activeTab === index ? '#ffffff' : '#e5e7eb',
                    textShadow: activeTab === index ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ 
        mt: 'auto', 
        p: 2, 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.6) 100%)'
      }}>
        <ListItemButton 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              transform: 'translateX(2px)',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
            },
            py: 1.5,
            px: 2
          }}
        >
          <ListItemIcon sx={{ 
            color: '#ef4444', 
            minWidth: 40,
            '& svg': { fontSize: 22 }
          }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: 500,
                color: '#ef4444'
              }
            }}
          />
        </ListItemButton>
      </Box>
    </>
  );

  const Sidebar = () => (
    <Box component="nav" sx={{ width: { lg: SIDEBAR_WIDTH }, flexShrink: { lg: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(145deg, #374151 0%, #1f2937 50%, #111827 100%)',
            color: 'white',
            borderRight: 'none',
            boxShadow: '8px 0 32px rgba(0, 0, 0, 0.4), inset -1px 0 0 rgba(255,255,255,0.1)',
            position: 'relative',
            height: '100vh',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(156, 163, 175, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(145deg, #374151 0%, #1f2937 50%, #111827 100%)',
            color: 'white',
            borderRight: 'none',
            boxShadow: '8px 0 32px rgba(0, 0, 0, 0.4), inset -1px 0 0 rgba(255,255,255,0.1)',
            position: 'relative',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(156, 163, 175, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2128&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        opacity: 0.3,
        zIndex: -2
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.6) 0%, rgba(75, 85, 99, 0.6) 50%, rgba(55, 65, 81, 0.6) 100%)',
        zIndex: -1
      }
    }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(55, 65, 81, 0.9)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(55, 65, 81, 1)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <Sidebar />
      
      <Box sx={{ 
        flexGrow: 1, 
        height: '100vh',
        overflow: 'auto',
        p: { xs: 2, sm: 3 },
        pt: { xs: 3, lg: 3 },
        width: { xs: '100%', lg: `calc(100% - ${SIDEBAR_WIDTH}px)` }
      }}>
        {tabs[activeTab]?.component}
      </Box>
    </Box>
  );
};

export default Dashboard;