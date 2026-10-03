// =============================================================
// WAKEEL — Reset Password Page
// Supabase puts auth token in URL; detectSessionInUrl=true handles it.
// =============================================================

import React, { useState, useEffect, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { AuthSplitLayout, AuthDisclaimer } from './LoginPage';

// ─── Password helpers ─────────────────────────────────────────
type StrengthLevel = 'weak' | 'fair' | 'strong';

function measureStrength(password: string): { level: StrengthLevel; label: string } {
  let score = 0;
  if (password.length >= 8)            score++;
  if (password.length >= 12)           score++;
  if (/[A-Z]/.test(password))          score++;
  if (/[0-9]/.test(password))          score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;

  if (score <= 2) return { level: 'weak',   label: 'Weak' };
  if (score <= 3) return { level: 'fair',   label: 'Fair' };
  return           { level: 'strong', label: 'Strong' };
}

const strengthBarColor: Record<StrengthLevel, string> = {
  weak:   'bg-[#DC2626]',
  fair:   'bg-[#D97706]',
  strong: 'bg-[#16A34A]',
};

const strengthTextColor: Record<StrengthLevel, string> = {
  weak:   'text-[#DC2626]',
  fair:   'text-[#D97706]',
  strong: 'text-[#16A34A]',
};

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { level, label } = measureStrength(password);
  const bars = Math.max(1, level === 'weak' ? 1 : level === 'fair' ? 2 : 3);

  return (
    <div className="flex flex-col gap-1.5 mt-1" aria-live="polite" aria-atomic="true">
      <div className="flex gap-1" role="img" aria-label={`Password strength: ${label}`}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= bars ? strengthBarColor[level] : 'bg-[#E7E5E4]',
            ].join(' ')}
          />
        ))}
      </div>
      <p className={['text-xs font-["DM_Sans"] font-medium', strengthTextColor[level]].join(' ')}>
        {label} password
      </p>
    </div>
  );
}

// ─── Password Input with toggle ───────────────────────────────
interface PWFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  showStrength?: boolean;
}

function PWField({ id, label, value, onChange, autoComplete = 'new-password', error, required, showStrength }: PWFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#1C1917] font-['DM_Sans']">
        {label}{required && <span className="text-[#DC2626] ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            'w-full h-11 rounded-lg border px-3 pr-10 text-sm font-["DM_Sans"] text-[#1C1917]',
            'bg-white placeholder-[#A8A29E] outline-none transition-colors',
            'focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]',
            error
              ? 'border-[#DC2626] focus:ring-[#DC2626] focus:border-[#DC2626]'
              : 'border-[#D6D3D1] hover:border-[#A8A29E]',
          ].join(' ')}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
        >
          {visible
            ? <EyeOff className="w-4 h-4" aria-hidden="true" />
            : <Eye className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
      {showStrength && <PasswordStrengthBar password={value} />}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#DC2626] font-['DM_Sans']">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── RESET PASSWORD PAGE ──────────────────────────────────────
export default function ResetPasswordPage() {
  const { resetPassword, session } = useAuth();
  const navigate = useNavigate();

  const passwordId = useId();
  const confirmId  = useId();

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  // Track if Supabase has parsed the recovery token from URL
  const [tokenReady, setTokenReady] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY event when it detects a recovery token in the URL.
    // We rely on session being set (detectSessionInUrl=true handles this automatically).
    // Give it 2 seconds to process the URL hash.
    const timer = setTimeout(() => {
      setTokenReady(!!session);
    }, 2000);
    return () => clearTimeout(timer);
  }, [session]);

  // If session appears while waiting, mark ready immediately
  useEffect(() => {
    if (session && tokenReady === null) {
      setTokenReady(true);
    }
  }, [session, tokenReady]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!password)               next.password = 'New password is required.';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (!confirm)                next.confirm  = 'Please confirm your new password.';
    else if (password !== confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    const result = await resetPassword(password);
    setLoading(false);

    if (!result.success) {
      setApiError(result.error ?? 'Failed to reset password. Please try again.');
      return;
    }

    setSuccess(true);
    // Navigate after a brief moment so user sees the success message
    setTimeout(() => {
      navigate('/login?reset=success', { replace: true });
    }, 2500);
  }

  // ── Loading state while Supabase processes URL token ─────────
  if (tokenReady === null) {
    return (
      <AuthSplitLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-sm text-[#78716C] font-['DM_Sans']">Verifying reset link…</p>
        </div>
      </AuthSplitLayout>
    );
  }

  // ── Invalid / expired token ───────────────────────────────────
  if (!tokenReady) {
    return (
      <AuthSplitLayout>
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <span className="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-[#DC2626]" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C1917]">
              Link expired or invalid
            </h2>
            <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans'] leading-relaxed">
              This reset link is invalid or has expired. Reset links are only valid for 1 hour.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2 rounded-lg font-['DM_Sans'] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
          >
            Request a new reset link
          </Link>
        </div>
        <AuthDisclaimer />
      </AuthSplitLayout>
    );
  }

  // ── Success state ─────────────────────────────────────────────
  if (success) {
    return (
      <AuthSplitLayout>
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <span className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#16A34A]" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C1917]">
              Password updated
            </h2>
            <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans']">
              Your password has been reset successfully. Redirecting to sign in…
            </p>
          </div>
        </div>
        <AuthDisclaimer />
      </AuthSplitLayout>
    );
  }

  // ── Main form ─────────────────────────────────────────────────
  return (
    <AuthSplitLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1917]">
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-[#78716C] font-['DM_Sans']">
            Choose a strong password for your account.
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
          <PWField
            id={passwordId}
            label="New password"
            value={password}
            onChange={v => { setPassword(v); setErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
            autoComplete="new-password"
            error={errors.password}
            required
            showStrength
          />

          <PWField
            id={confirmId}
            label="Confirm new password"
            value={confirm}
            onChange={v => { setConfirm(v); setErrors(p => { const n = { ...p }; delete n.confirm; return n; }); }}
            autoComplete="new-password"
            error={errors.confirm}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            aria-label="Set new password"
            className="mt-1"
          >
            Set New Password
          </Button>
        </form>

        <AuthDisclaimer />
      </div>
    </AuthSplitLayout>
  );
}
