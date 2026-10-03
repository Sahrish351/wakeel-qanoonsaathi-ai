// =============================================================
// WAKEEL — Register Page
// Real Supabase signUp. Shows email verification notice on success.
// =============================================================

import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, FileText, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { AuthSplitLayout, TextInput, AuthDisclaimer } from './LoginPage';

// ─── Helpers ─────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Password Strength ────────────────────────────────────────
type StrengthLevel = 'weak' | 'fair' | 'strong';

function measureStrength(password: string): { level: StrengthLevel; score: number; label: string } {
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 'weak',   score, label: 'Weak' };
  if (score <= 3) return { level: 'fair',   score, label: 'Fair' };
  return           { level: 'strong', score, label: 'Strong' };
}

const strengthColors: Record<StrengthLevel, string> = {
  weak:   'bg-[#DC2626]',
  fair:   'bg-[#D97706]',
  strong: 'bg-[#16A34A]',
};

const strengthTextColors: Record<StrengthLevel, string> = {
  weak:   'text-[#DC2626]',
  fair:   'text-[#D97706]',
  strong: 'text-[#16A34A]',
};

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { level, score, label } = measureStrength(password);
  const filledBars = Math.max(1, Math.min(3, Math.ceil((score / 5) * 3)));

  return (
    <div className="flex flex-col gap-1.5 mt-1" aria-live="polite" aria-atomic="true">
      <div className="flex gap-1" role="img" aria-label={`Password strength: ${label}`}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= filledBars ? strengthColors[level] : 'bg-[#E7E5E4]',
            ].join(' ')}
          />
        ))}
      </div>
      <p className={['text-xs font-["DM_Sans"] font-medium', strengthTextColors[level]].join(' ')}>
        {label} password
        {level === 'weak' && ' — add uppercase letters, numbers, or symbols'}
      </p>
    </div>
  );
}

// ─── Password Input ───────────────────────────────────────────
interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  showStrength?: boolean;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = 'new-password',
  error,
  required,
  showStrength,
}: PasswordFieldProps) {
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
          aria-describedby={[error ? `${id}-error` : '', showStrength ? `${id}-strength` : ''].filter(Boolean).join(' ') || undefined}
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
      {showStrength && <div id={`${id}-strength`}><PasswordStrengthBar password={value} /></div>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#DC2626] font-['DM_Sans']">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Inline Error ─────────────────────────────────────────────
function InlineError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-sm text-[#DC2626] font-['DM_Sans']"
    >
      {message}
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────
function VerificationSentState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <span className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-[#16A34A]" aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C1917]">
          Check your inbox
        </h2>
        <p className="mt-2 text-sm text-[#78716C] font-['DM_Sans'] leading-relaxed">
          We've sent a verification link to{' '}
          <strong className="text-[#1C1917] font-medium">{email}</strong>.
          Click the link in the email to activate your account.
        </p>
      </div>
      <div className="w-full rounded-lg bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3 text-sm text-[#92400E] font-['DM_Sans'] text-left">
        <strong>Didn't receive it?</strong> Check your spam or junk folder. The link expires in 24 hours.
      </div>
      <p className="text-sm text-[#78716C] font-['DM_Sans']">
        Already verified?{' '}
        <Link
          to="/login"
          className="text-[#7C3AED] hover:text-[#6D28D9] font-medium underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────
export default function RegisterPage() {
  const { signUp } = useAuth();

  const nameId            = useId();
  const emailId           = useId();
  const passwordId        = useId();
  const confirmPasswordId = useId();

  const [fullName, setFullName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirm]     = useState('');
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [apiError, setApiError]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [successEmail, setSuccessEmail]   = useState('');

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim())                 next.fullName = 'Full name is required.';
    if (!email.trim())                    next.email = 'Email address is required.';
    else if (!isValidEmail(email))        next.email = 'Please enter a valid email address.';
    if (!password)                        next.password = 'Password is required.';
    else if (password.length < 8)         next.password = 'Password must be at least 8 characters.';
    if (!confirmPassword)                 next.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function clearFieldError(field: string) {
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    const result = await signUp({ email: email.trim(), password, fullName: fullName.trim() });
    setLoading(false);

    if (!result.success) {
      setApiError(result.error ?? 'Registration failed. Please try again.');
      return;
    }

    setSuccessEmail(email.trim());
  }

  if (successEmail) {
    return (
      <AuthSplitLayout>
        <VerificationSentState email={successEmail} />
        <AuthDisclaimer />
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1917]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[#78716C] font-['DM_Sans']">
            Free to use. Your data stays private.
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
            id={nameId}
            label="Full name"
            value={fullName}
            onChange={v => { setFullName(v); clearFieldError('fullName'); }}
            autoComplete="name"
            error={errors.fullName}
            required
            placeholder="e.g. Ali Hassan"
          />

          <TextInput
            id={emailId}
            label="Email address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); clearFieldError('email'); setApiError(''); }}
            autoComplete="email"
            error={errors.email}
            required
          />

          <PasswordField
            id={passwordId}
            label="Password"
            value={password}
            onChange={v => { setPassword(v); clearFieldError('password'); }}
            autoComplete="new-password"
            error={errors.password}
            required
            showStrength
          />

          <PasswordField
            id={confirmPasswordId}
            label="Confirm password"
            value={confirmPassword}
            onChange={v => { setConfirm(v); clearFieldError('confirmPassword'); }}
            autoComplete="new-password"
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            aria-label="Create your Wakeel account"
            className="mt-1"
          >
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center text-[#78716C] font-['DM_Sans']">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#7C3AED] hover:text-[#6D28D9] font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
          >
            Sign in
          </Link>
        </p>

        <AuthDisclaimer />
      </div>
    </AuthSplitLayout>
  );
}
