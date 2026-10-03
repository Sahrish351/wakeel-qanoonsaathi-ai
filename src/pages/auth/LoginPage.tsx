// =============================================================
// WAKEEL — Login Page
// Real Supabase signIn. No demo bypass. No fake credentials.
// =============================================================

import React, { useState, useId } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, FileText, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

// ─── Helpers ─────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── AuthLayout shared across all auth pages ─────────────────
export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF8F5]">
      {/* ── Left branding panel (desktop only) ── */}
      <div
        className="hidden md:flex md:w-1/2 lg:w-[45%] flex-col justify-between p-10 lg:p-16"
        style={{ background: 'linear-gradient(160deg, #FAF8F5 0%, #EDE9FE 100%)' }}
        aria-hidden="true"
      >
        <WakeelLogo />

        <div className="flex-1 flex flex-col justify-center gap-8 py-12">
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-semibold text-[#1C1917] leading-tight">
              Pakistan's AI-Powered<br />Legal Companion
            </h2>
            <p className="mt-4 text-[#78716C] text-lg font-['DM_Sans'] leading-relaxed">
              Understand your rights. Know your options.<br />Act with confidence.
            </p>
          </div>

          <ul className="flex flex-col gap-5" role="list">
            {[
              { Icon: ShieldCheck, text: 'Confidential, judgment-free legal guidance' },
              { Icon: FileText,    text: 'Plain-language explanations of Pakistani law' },
              { Icon: Users,       text: 'Connect with verified lawyers when you need more' },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#7C3AED]" aria-hidden="true" />
                </span>
                <span className="text-[#44403C] font-['DM_Sans'] text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-[#A8A29E] font-['DM_Sans']">
          © {new Date().getFullYear()} Wakeel — QanoonSaathi AI
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 md:py-0">
        {/* Mobile logo */}
        <div className="mb-8 md:hidden">
          <WakeelLogo />
        </div>
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function WakeelLogo() {
  return (
    <div>
      <span className="font-['Cormorant_Garamond'] text-3xl font-bold text-[#7C3AED] tracking-tight">
        Wakeel
      </span>
      <p className="font-['DM_Sans'] text-sm text-[#78716C] mt-0.5">Your AI Legal Guide</p>
    </div>
  );
}

// ─── Password Toggle Input ────────────────────────────────────
interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  error,
  required,
}: PasswordInputProps) {
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
          tabIndex={0}
        >
          {visible
            ? <EyeOff className="w-4 h-4" aria-hidden="true" />
            : <Eye className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#DC2626] font-['DM_Sans']">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────────────
interface TextInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function TextInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  error,
  required,
  placeholder,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#1C1917] font-['DM_Sans']">
        {label}{required && <span className="text-[#DC2626] ml-0.5" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        className={[
          'w-full h-11 rounded-lg border px-3 text-sm font-["DM_Sans"] text-[#1C1917]',
          'bg-white placeholder-[#A8A29E] outline-none transition-colors',
          'focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]',
          error
            ? 'border-[#DC2626] focus:ring-[#DC2626] focus:border-[#DC2626]'
            : 'border-[#D6D3D1] hover:border-[#A8A29E]',
        ].join(' ')}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#DC2626] font-['DM_Sans']">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Disclaimer ───────────────────────────────────────────────
export function AuthDisclaimer() {
  return (
    <p className="text-xs text-[#A8A29E] font-['DM_Sans'] text-center leading-relaxed mt-6">
      Wakeel provides legal information, not legal advice. For matters requiring
      professional representation, please consult a qualified lawyer.
    </p>
  );
}

// ─── Inline Error Banner ──────────────────────────────────────
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

// ─── LOGIN PAGE ───────────────────────────────────────────────
export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email.trim())           next.email    = 'Email address is required.';
    else if (!isValidEmail(email)) next.email  = 'Please enter a valid email address.';
    if (!password)               next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    const result = await signIn({ email: email.trim(), password });
    setLoading(false);

    if (!result.success) {
      setApiError(result.error ?? 'Sign in failed. Please try again.');
      return;
    }

    const redirect = searchParams.get('redirect');
    navigate(redirect && redirect.startsWith('/') ? redirect : '/dashboard', { replace: true });
  }

  return (
    <AuthSplitLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1917]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#78716C] font-['DM_Sans']">
            Sign in to continue to Wakeel.
          </p>
        </div>

        {apiError && <InlineError message={apiError} />}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <TextInput
            id={emailId}
            label="Email address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined })); setApiError(''); }}
            autoComplete="email"
            error={errors.email}
            required
          />

          <div className="flex flex-col gap-1.5">
            <PasswordInput
              id={passwordId}
              label="Password"
              value={password}
              onChange={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined })); setApiError(''); }}
              autoComplete="current-password"
              error={errors.password}
              required
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#7C3AED] hover:text-[#6D28D9] font-['DM_Sans'] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            aria-label="Sign in to your account"
          >
            Sign In
          </Button>
        </form>

        <p className="text-sm text-center text-[#78716C] font-['DM_Sans']">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#7C3AED] hover:text-[#6D28D9] font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
          >
            Create one
          </Link>
        </p>

        <AuthDisclaimer />
      </div>
    </AuthSplitLayout>
  );
}
