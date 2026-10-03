// =============================================================
// WAKEEL — Authentication Context
// Real Supabase Auth — no localStorage bypass, no demo login.
// =============================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/types';

// ─── CONTEXT SHAPE ───────────────────────────────────────────
interface AuthContextValue {
  // State
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signUp: (params: SignUpParams) => Promise<AuthResult>;
  signIn: (params: SignInParams) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (newPassword: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

// ─── CONTEXT ─────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── PROVIDER ────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load profile from DB ──────────────────────────────────
  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[Auth] Profile load error:', error.message);
      return;
    }

    setProfile(data as Profile);
  }, []);

  // ── Refresh profile ───────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user.id);
  }, [user, loadProfile]);

  // ── Initialize session on mount ───────────────────────────
  useEffect(() => {
    // Get existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          await loadProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Session refreshed silently — profile stays the same
        }

        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // ── Sign up ───────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, fullName }: SignUpParams): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (error) {
      return { success: false, error: formatAuthError(error) };
    }

    return { success: true };
  }, []);

  // ── Sign in ───────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password }: SignInParams): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: formatAuthError(error) };
    }

    return { success: true };
  }, []);

  // ── Sign out ──────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  // ── Forgot password ───────────────────────────────────────
  const forgotPassword = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: formatAuthError(error) };
    }

    return { success: true };
  }, []);

  // ── Reset password ────────────────────────────────────────
  const resetPassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      return { success: false, error: formatAuthError(error) };
    }

    return { success: true };
  }, []);

  // ── Update profile ────────────────────────────────────────
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw new Error(error.message);

    await loadProfile(user.id);
  }, [user, loadProfile]);

  const role = (profile?.role ?? null) as UserRole | null;
  const isAuthenticated = !!session && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isLoading,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ─── HELPERS ─────────────────────────────────────────────────
function formatAuthError(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Incorrect email or password. Please try again.';
    case 'Email not confirmed':
      return 'Please verify your email address before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 8 characters.';
    case 'Email rate limit exceeded':
      return 'Too many requests. Please wait a few minutes before trying again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

