import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ProgressProvider } from '../contexts/ProgressContext';

// Wrap the entire application with providers
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </AuthProvider>
  );
}
