'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

type Props = {
  onSubmit: (values: { email: string; password: string }) => void;
  isLoading: boolean;
  errorMessage?: string;
  demoCredentials?: { email: string; password: string };
};

// Pure presenter: no API calls, no Redux — just form state + callback.
export function LoginForm({ onSubmit, isLoading, errorMessage, demoCredentials }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const fieldClass =
    'h-11 w-full rounded-lg border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10';

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.6 5.2A9.8 9.8 0 0 1 12 5c5 0 9 4.5 9 7a11.6 11.6 0 0 1-2.4 3.3" />
                <path d="M6.6 6.6C3.9 8.3 3 11.4 3 12c0 2.5 4 7 9 7a9.6 9.6 0 0 0 4-.8" />
                <path d="m9.9 9.9a3 3 0 0 0 4.2 4.2" />
                <path d="m3 3 18 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5" />
            <path d="M12 16.5h.01" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-1 h-11 w-full rounded-lg bg-slate-900 text-sm tracking-wide text-white hover:bg-slate-800"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.2-8.6" />
            </svg>
            Signing inâ€¦
          </span>
        ) : (
          'Sign in'
        )}
      </Button>

      {demoCredentials && (
        <div className="mt-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3.5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700">Demo access</p>
              <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
                {demoCredentials.email} · {demoCredentials.password}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(demoCredentials.email);
                setPassword(demoCredentials.password);
              }}
              className="shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Fill
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
