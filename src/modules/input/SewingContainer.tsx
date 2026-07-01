'use client';

import { InputContainer } from './InputContainer';
import { InputType } from '../../types';

// Thin wrapper — keeps a dedicated file per input type (as scaffolded)
// while all real logic lives once in InputContainer.tsx.
export default function SewingContainer() {
  return <InputContainer type={InputType.SEWING} />;
}
