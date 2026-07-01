import { InputHTMLAttributes } from 'react';
import { cn } from '../../core/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10',
        className,
      )}
      {...props}
    />
  );
}
