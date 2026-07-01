'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from './components/LoginForm';
import { useLoginMutation } from './api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';

// Container: owns the RTK Query call + navigation/redirect logic.
// Backend's login response body includes the accessToken JWT — decoded
// here only to know the role for client-side routing; the cookie itself
// (not this decoded copy) is what actually authenticates every request.
export default function LoginContainer() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (values: { email: string; password: string }) => {
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

    router.push(payload.role === Role.ADMIN ? '/admin/dashboard' : '/user/dashboard');
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      errorMessage={error ? 'Invalid email or password' : undefined}
    />
  );
}
