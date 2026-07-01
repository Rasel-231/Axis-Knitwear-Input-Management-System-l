'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../core/lib/utils';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/inputs', label: 'Inputs' },
];

const userLinks = [
  { href: '/user/dashboard', label: 'Dashboard' },
  { href: '/user/inputs', label: 'Inputs' },
];

export function Sidebar({ role }: { role: 'admin' | 'user' }) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-56 border-r h-full bg-white p-4 flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'px-3 py-2 rounded-md text-sm',
            pathname === link.href ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100',
          )}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
