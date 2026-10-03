// =============================================================
// WAKEEL — Verify Email Page
// Supabase handles token exchange automatically via detectSessionInUrl=true
// This page is the landing page after the user clicks the email link.
// =============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, MailCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { AuthSplitLayout, AuthDisclaimer } from './LoginPage';

type VerifyState = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshProfile } = useAuth();

  const [state, setVerifyState] = useState<VerifyState>('verifying');
  const [errorMessage, setErrorMessage]   = useState('');
  const [resendEmail, setResendEmail]     = useState('');
  const [resending, setResending]         = useState(false);
  const [resendSent, setResendSent]       = useState(false);

  useEffect(() => {
    // Supabase automatically processes the token in the URL hash.
    // We listen for the SIGNED_IN event which fires after successful verification.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await refreshProfile();
        setVerifyState('success');
      } else if (event === 'USER_UPDATED' && session?.user) {
        await refreshProfile();
        setVerifyState('success');
      }
    });

    // If user is already signed in (token already processed), show success
    if (user) {
      setVerifyState('success');
    }

    // If URL contains error params set by Supabase
    const errorCode    = searchParams.get('error_code');
    const errorDesc    = searchParams.get('error_description');
    if (errorCode) {
      setVerifyState('error');
      setErrorMessage(
        errorDesc?.replace(/\+/g, ' ') ||
        'Verification failed. The link may have expired.'
      );
    }

    // Timeout fallback — if nothing resolved after 6 seconds, show error
    const timeout = setTimeout(() => {
      setVerifyState(prev => {
        if (prev === 'verifying') {
          setErrorMessage('Verification timed out. The link may have expired or already been used.');
          return 'error';
        }
        return prev;
      });
    }, 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [user, searchParams, refreshProfile]);

  async function handleResend() {
    if (!resendEmail || resending) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: resendEmail,
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    setResending(false);
    if (!error) setResendSent(true);
  }

  // ── Verifying ────────────────────────────────────────────────
  if (state === 'verifying') {
    return (
      <AuthSplitLayout>
        <div className="flex flex-col items-center justify-center gap-5 py-10" role="status" aria-live="polite">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#EDE9FE] flex items-center justify-center">
              <MailCheck className="w-9 h-9 text-[#7C3AED]" aria-hidden="true" />
            </div>
            <Loader2
              className="absolute -bottom-1 -right-1 w-6 h-6 text-[#7C3AED] animate-spin"
              aria-hidden="true"
            />
          </div>
          <div className="text-center">
            <h1 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C1917]">
              Verifying your email…
            </h1>
            <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans']">
              Please wait while we confirm your email address.
            </p>
          </div>
        </div>
        <AuthDisclaimer />
      </AuthSplitLayout>
    );
  }

  // ── Success ───────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <AuthSplitLayout>
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <span className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A]" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1917]">
              Email verified!
            </h1>
            <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans'] leading-relaxed">
              Welcome to Wakeel — QanoonSaathi AI. Your account is ready.
            </p>
          </div>

          <div className="w-full rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] px-4 py-3 text-sm text-[#5B21B6] font-['DM_Sans'] text-left">
            Let's take a moment to personalise your experience before you start.
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/onboarding', { replace: true })}
            aria-label="Continue to account setup"
          >
            Set Up Your Account
          </Button>

          <button
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="text-sm text-[#78716C] hover:text-[#1C1917] font-['DM_Sans'] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
          >
            Skip setup, go to dashboard
          </button>
        </div>
        <AuthDisclaimer />
      </AuthSplitLayout>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  return (
    <AuthSplitLayout>
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <span className="w-20 h-20 rounded-full bg-[#FEF2F2] flex items-center justify-center">
          <XCircle className="w-10 h-10 text-[#DC2626]" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1917]">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans'] leading-relaxed">
            {errorMessage || 'The verification link may have expired or already been used.'}
          </p>
        </div>

        {resendSent ? (
          <div
            role="status"
            className="w-full rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-3 text-sm text-[#065F46] font-['DM_Sans'] text-left"
          >
            A new verification link has been sent. Please check your inbox.
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <p className="text-sm text-[#78716C] font-['DM_Sans'] text-left">
              Request a new verification email:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={resendEmail}
                onChange={e => setResendEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address to resend verification"
                autoComplete="email"
                className="flex-1 h-11 rounded-lg border border-[#D6D3D1] px-3 text-sm font-['DM_Sans'] text-[#1C1917] bg-white placeholder-[#A8A29E] outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors"
              />
              <Button
                variant="primary"
                size="md"
                loading={resending}
                disabled={resending || !resendEmail}
                onClick={handleResend}
                aria-label="Resend verification email"
              >
                Resend
              </Button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-sm text-[#7C3AED] hover:text-[#6D28D9] font-['DM_Sans'] font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
        >
          Back to sign in
        </button>
      </div>
      <AuthDisclaimer />
    </AuthSplitLayout>
  );
}
