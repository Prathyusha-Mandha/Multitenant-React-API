import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface SplitLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export default function SplitLayout({ leftPanel, rightPanel }: SplitLayoutProps) {
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '40vh', md: '100vh' }
      }}>
        {leftPanel}
      </Box>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        minHeight: { xs: '60vh', md: '100vh' }
      }}>
        {rightPanel}
      </Box>
    </Box>
  );
}