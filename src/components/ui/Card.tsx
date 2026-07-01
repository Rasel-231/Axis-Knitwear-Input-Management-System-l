import { HTMLAttributes } from 'react';
import { cn } from '../../core/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border border-gray-200 rounded-lg p-5 bg-white', className)} {...props} />;
}
