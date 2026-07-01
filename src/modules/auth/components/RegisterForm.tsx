'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

type Props = {
  onSubmit: (values: { name: string; email: string; password: string }) => void;
  isLoading: boolean;
  errorMessage?: string;
};

export function RegisterForm({ onSubmit, isLoading, errorMessage }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
}
