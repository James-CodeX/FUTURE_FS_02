'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-zinc-900">Something went wrong</h1>
            <p className="text-sm text-zinc-600">
              We apologize for the inconvenience. An unexpected error occurred.
            </p>
            {error.digest && (
              <p className="text-xs text-zinc-400">Error ID: {error.digest}</p>
            )}
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
