'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

// Wraps the app in root layout.tsx. Client component since Redux's
// Provider needs the browser context.
export default function Providers({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
