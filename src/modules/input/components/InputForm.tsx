'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input as TextInput } from '../../../components/ui/Input';
import { InputType } from '../../../types';

type Props = {
  type: InputType;
  onSubmit: (values: { quantity: number; remarks?: string }) => void;
  isLoading: boolean;
};

// Presenter: one form reused by Cutting/Sewing/Rib containers via `type` prop.
export function InputForm({ type, onSubmit, isLoading }: Props) {
  const [quantity, setQuantity] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ quantity: Number(quantity), remarks: remarks || undefined });
    setQuantity('');
    setRemarks('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <h3 className="font-semibold text-sm text-gray-600">New {type} entry</h3>
      <TextInput
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        min={1}
      />
      <TextInput placeholder="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
