'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Something went wrong</h2>
        <p className="text-sm text-zinc-600">
          We couldn&apos;t load this page. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-zinc-400">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
