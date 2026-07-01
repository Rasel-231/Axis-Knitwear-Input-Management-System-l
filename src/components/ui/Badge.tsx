import { ReactNode } from 'react';
import { cn } from '../../core/lib/utils';

type Variant = 'pending' | 'success' | 'danger' | 'default';

const variantClasses: Record<Variant, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

export function Badge({ variant = 'default', children }: { variant?: Variant; children: ReactNode }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', variantClasses[variant])}>{children}</span>
  );
}
