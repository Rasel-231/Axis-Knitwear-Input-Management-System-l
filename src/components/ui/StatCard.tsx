import { ReactNode } from 'react';
import { cn } from '../../core/lib/utils';

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: ReactNode;
};

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
};

export function StatCard({ label, value, hint, tone = 'default', icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon && <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', toneClasses[tone])}>{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
