import type { Metadata } from 'next';
import Providers from '../core/store/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Production Management System',
  description: 'Real-time production tracking — Cutting, Sewing, Rib',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
