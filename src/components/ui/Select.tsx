import { SelectHTMLAttributes } from 'react';
import { cn } from '../../core/lib/utils';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
