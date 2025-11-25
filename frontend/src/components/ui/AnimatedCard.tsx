import { Card, CardContent } from '@mui/material';
import type { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
}

export default function AnimatedCard({ children }: AnimatedCardProps) {
  return (
    <Card sx={{
      maxWidth: 400,
      width: '100%',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <CardContent sx={{ p: 4 }}>
        {children}
      </CardContent>
    </Card>
  );
}