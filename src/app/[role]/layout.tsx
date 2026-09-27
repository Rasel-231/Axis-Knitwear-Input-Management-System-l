'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_PATH, isRole } from '../../core/lib/roleMeta';
import { Role } from '../../types';

/**
 * One shell for every role. The [role] segment decides which sidebar is
 * rendered and the page redirects if it does not match the signed-in role,
 * so a user cannot open another role's workspace by typing the URL.
 */
export default function RoleLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ role: string }>();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const segment = params.role;
  const signedInRole = (user?.role ?? Role.USER) as Role;

  useEffect(() => {
    if (!isRole(segment)) {
      router.replace('/login');
      return;
    }
    if (isAuthenticated && user?.role !== segment) {
      router.replace(ROLE_PATH[(user?.role ?? Role.USER) as Role]);
    }
  }, [segment, isAuthenticated, user, router]);

  const role = isRole(segment) ? segment : signedInRole;

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
