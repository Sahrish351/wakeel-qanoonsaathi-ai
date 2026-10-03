// =============================================================
// WAKEEL — Safety Context
// Manages safety mode state for sensitive situations.
// =============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

interface SafetyContextValue {
  safetyMode: boolean;
  enableSafetyMode: () => void;
  disableSafetyMode: () => void;
  quickExit: () => void;
}

const SafetyContext = createContext<SafetyContextValue | null>(null);

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [safetyMode, setSafetyMode] = useState(false);

  const enableSafetyMode = useCallback(() => {
    setSafetyMode(true);
  }, []);

  const disableSafetyMode = useCallback(() => {
    setSafetyMode(false);
  }, []);

  /**
   * Quick Exit: navigates to a neutral URL.
   * NOTE: This does NOT guarantee device-level privacy.
   * The user's browser history, installed apps, and device may retain
   * information. This is a convenience feature only.
   */
  const quickExit = useCallback(() => {
    // Navigate to a neutral, non-suspicious URL
    window.location.replace('https://www.google.com');
  }, []);

  return (
    <SafetyContext.Provider
      value={{ safetyMode, enableSafetyMode, disableSafetyMode, quickExit }}
    >
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety(): SafetyContextValue {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}

