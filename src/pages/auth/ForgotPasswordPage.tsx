// =============================================================
// WAKEEL — Forgot Password Page
// Security-neutral: does not reveal whether email exists.
// =============================================================

import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { AuthSplitLayout, TextInput, AuthDisclaimer } from './LoginPage';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Success State ────────────────────────────────────────────
function ResetLinkSentState() {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <span className="w-16 h-16 rounded-full bg-[#EDE9FE] flex items-center justify-center">
        <MailCheck className="w-8 h-8 text-[#7C3AED]" aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C1917]">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans'] leading-relaxed">
          If an account exists with that email address, we've sent a password reset link.
          The link expires in 1 hour.
        </p>
      </div>
      <div className="w-full rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] px-4 py-3 text-sm text-[#5B21B6] font-['DM_Sans'] text-left">
        Check your spam or junk folder if you don't see it within a few minutes.
      </div>
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-sm text-[#7C3AED] hover:text-[#6D28D9] font-['DM_Sans'] font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to sign in
      </Link>
    </div>
  );
}

// ─── FORGOT PASSWORD PAGE ─────────────────────────────────────
export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const emailId = useId();

  const [email, setEmail]     = useState('');
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  function validate(): boolean {
    if (!email.trim()) {
      setEmailError('Email address is required.');
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    const result = await forgotPassword(email.trim());
    setLoading(false);

    if (!result.success) {
      // Only surface genuine technical errors (rate limit, etc.)
      // Never reveal whether email exists.
      const isRateLimit = result.error?.toLowerCase().includes('rate limit') ||
                          result.error?.toLowerCase().includes('too many');
      if (isRateLimit) {
        setApiError('Too many requests. Please wait a few minutes before trying again.');
        return;
      }
    }

    // Always show success — security best practice
    setSent(true);
  }

  return (
    <AuthSplitLayout>
      {sent ? (
        <>
          <ResetLinkSentState />
          <AuthDisclaimer />
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1917]">
              Reset your password
            </h1>
            <p className="mt-1 text-sm text-[#78716C] font-['DM_Sans']">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {apiError && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-sm text-[#DC2626] font-['DM_Sans']"
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <TextInput
              id={emailId}
              label="Email address"
              type="email"
              value={email}
              onChange={v => { setEmail(v); setEmailError(''); setApiError(''); }}
              autoComplete="email"
              error={emailError}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
              aria-label="Send password reset link"
            >
              Send Reset Link
            </Button>
          </form>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] font-['DM_Sans'] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to sign in
          </Link>

          <AuthDisclaimer />
        </div>
      )}
    </AuthSplitLayout>
  );
}
