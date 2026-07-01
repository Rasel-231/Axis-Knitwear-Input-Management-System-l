'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-black text-white rounded-md text-sm">
        Try again
      </button>
    </div>
  );
}
