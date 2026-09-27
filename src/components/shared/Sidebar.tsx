'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../core/lib/utils';
import { ROLE_META, ROLE_PATH } from '../../core/lib/roleMeta';
import { Role } from '../../types';

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const Icon = ({ path }: { path: string }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const PATHS = {
  dashboard: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z',
  inputs: 'M4 6h16M4 12h16M4 18h10',
  newInput: 'M12 5v14M5 12h14',
  print: 'M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8v-7Z',
  sent: 'M3 12l18-8-8 18-2-8-8-2Z',
  received: 'M20 6 9 17l-5-5',
  overview: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
};

const buildLinks = (role: Role): NavItem[] => {
  const base = ROLE_PATH[role];
  const meta = ROLE_META[role];
  const links: NavItem[] = [
    { href: `${base}/dashboard`, label: 'Dashboard', icon: <Icon path={PATHS.dashboard} /> },
    { href: `${base}/inputs`, label: 'Production input', icon: <Icon path={PATHS.inputs} /> },
  ];

  if (meta.canCreateInput) {
    links.push({ href: `${base}/inputs/new`, label: 'New input', icon: <Icon path={PATHS.newInput} /> });
  }

  if (meta.canAccessPrint) {
    links.push(
      { href: `${base}/print/sent`, label: 'Sent printing', icon: <Icon path={PATHS.sent} /> },
      { href: `${base}/print/received`, label: 'Received printing', icon: <Icon path={PATHS.received} /> },
      { href: `${base}/print/overview`, label: 'Day print body', icon: <Icon path={PATHS.overview} /> },
    );
  }

  return links;
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const links = buildLinks(role);
  const meta = ROLE_META[role];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">PMS</p>
        <p className="text-xs text-slate-500">{meta.label}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active ? 'bg-slate-900 font-medium text-white' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <p className="text-[11px] leading-relaxed text-slate-400">{meta.description}</p>
      </div>
    </aside>
  );
}
