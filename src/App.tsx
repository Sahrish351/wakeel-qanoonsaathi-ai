// =============================================================
// WAKEEL — App Root
// =============================================================

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SafetyProvider } from '@/contexts/SafetyContext';
import { AppRouter } from '@/router';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SafetyProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </SafetyProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

