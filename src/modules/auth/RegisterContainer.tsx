'use client';

import { useRouter } from 'next/navigation';
import { RegisterForm } from './components/RegisterForm';
import { useRegisterMutation } from './api/authApi';

export default function RegisterContainer() {
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    await registerUser(values).unwrap();
    router.push('/login');
  };

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      errorMessage={error ? 'Registration failed. Try a different email.' : undefined}
    />
  );
}
