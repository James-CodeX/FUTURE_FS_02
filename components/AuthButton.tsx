"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type User = { id: number; username: string; name?: string | null; role: 'USER' | 'ADMIN' };

export default function AuthButton({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialUser) return;
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setUser(d?.user ?? null))
      .catch(() => {});
  }, [initialUser]);

  async function logout() {
    setLoading(true);
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      setUser(null);
      // after clearing cookie do a hard reload to avoid cached session
      window.location.href = '/';
    } finally { setLoading(false); }
  }

  if (!user) return <Link href="/login" className="hover:text-sky-700">Login / Signup</Link>;
  return (
    <div className="flex items-center gap-3">
      <Link href="/account" className="hover:text-sky-700">Account</Link>
      {user.role === 'ADMIN' && (
        <Link href="/admin" className="hover:text-sky-700">Admin</Link>
      )}
      <button onClick={logout} disabled={loading} className="text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50">Logout</button>
    </div>
  );
}
