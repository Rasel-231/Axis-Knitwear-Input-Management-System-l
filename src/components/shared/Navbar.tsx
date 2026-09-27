'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../modules/auth/api/authApi';
import { refreshDemoSession } from '../../modules/auth/demoAuth';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ALL_ROLES, ROLE_META, ROLE_PATH } from '../../core/lib/roleMeta';
import { Role } from '../../types';

const isDev = process.env.NODE_ENV === 'development';

export function Navbar() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [logoutMutation] = useLogoutMutation();

  const role = (user?.role ?? Role.USER) as Role;
  const meta = ROLE_META[role];

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } catch {
      // Demo sessions have no server side logout to call.
    }
    logout();
    router.push('/login');
  };

  const switchRole = (next: Role) => {
    setUser({
      id: user?.id ?? 'demo-user-0001',
      name: user?.name || ROLE_META[next].short,
      email: user?.email ?? 'halifax980@gmail.com',
      role: next,
      createdAt: user?.createdAt ?? '',
      updatedAt: user?.updatedAt ?? '',
    });
    refreshDemoSession(next);
    router.push(`${ROLE_PATH[next]}/dashboard`);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-900">Production Management System</span>
        <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 sm:inline">
          {meta.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isDev && (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-2 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">View as</span>
            <Select
              aria-label="Preview another role"
              value={role}
              onChange={(e) => switchRole(e.target.value as Role)}
              className="h-7 w-44 border-amber-300 bg-white text-xs"
            >
              {ALL_ROLES.map((item) => (
                <option key={item} value={item}>
                  {ROLE_META[item].label}
                </option>
              ))}
            </Select>
          </div>
        )}

        <span className="hidden text-xs text-slate-500 md:inline">{user?.email}</span>
        <Button size="sm" variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
