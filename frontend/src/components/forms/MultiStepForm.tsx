import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface MultiStepFormProps {
  children: ReactNode;
}

export default function MultiStepForm({ children }: MultiStepFormProps) {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      {children}
    </Box>
  );
}