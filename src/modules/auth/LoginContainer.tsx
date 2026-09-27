'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from './components/LoginForm';
import { useLoginMutation } from './api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_CREDENTIALS, isDemoCredentials, startDemoSession } from './demoAuth';
import { Role } from '../../types';

// Container: owns the RTK Query call + navigation/redirect logic.
// Backend's login response body includes the accessToken JWT — decoded
// here only to know the role for client-side routing; the cookie itself
// (not this decoded copy) is what actually authenticates every request.
export default function LoginContainer() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [login, { isLoading, error }] = useLoginMutation();

  const redirectByRole = (role: Role) => router.push(`/${role.toLowerCase()}/dashboard`);

  const handleSubmit = async (values: { email: string; password: string }) => {
    if (isDemoCredentials(values.email, values.password)) {
      setUser(startDemoSession(Role.ADMIN));
      redirectByRole(Role.ADMIN);
      return;
    }

    const result = await login(values).unwrap();
    const payload = JSON.parse(atob(result.data!.accessToken.split('.')[1]));

    setUser({
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: '',
      createdAt: '',
      updatedAt: '',
    });

    redirectByRole(payload.role);
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      errorMessage={error ? 'Invalid email or password' : undefined}
      demoCredentials={DEMO_CREDENTIALS}
    />
  );
}
