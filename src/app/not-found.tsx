import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h2 className="text-2xl font-bold">404</h2>
      <p className="text-sm text-gray-500">This page doesn't exist.</p>
      <Link href="/login" className="text-sm underline">
        Go to login
      </Link>
    </div>
  );
}
