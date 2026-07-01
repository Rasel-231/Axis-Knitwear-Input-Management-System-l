'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../modules/auth/api/authApi';
import { Button } from '../ui/Button';

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
    logout();
    router.push('/login');
  };

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-white">
      <span className="font-semibold">Production Management System</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">
          {user?.email} · {user?.role}
        </span>
        <Button size="sm" variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
