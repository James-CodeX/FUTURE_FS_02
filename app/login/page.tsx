"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Me = { id: number; email: string; username: string; role: string; name?: string | null };

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get('redirect') || '/';
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(u => setMe(u?.user ?? null))
      .catch(() => setMe(null));
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Login failed'); }
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, name }),
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Signup failed'); }
      router.push(redirect);
      router.refresh();
    } catch (err: any) { setError(err.message || 'Signup failed'); }
    finally { setLoading(false); }
  }

  async function logout() {
    setLoading(true); setError(null);
    try { await fetch('/api/auth/login', { method: 'DELETE' }); router.refresh(); setMe(null); }
    finally { setLoading(false); }
  }

  if (me) {
    return (
      <div className="space-y-4">
        <p className="text-sm">Logged in as <span className="font-medium">{me.name || me.username}</span></p>
        <div className="flex gap-2">
          <button onClick={() => router.push('/')} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-zinc-300 hover:bg-zinc-50">Go home</button>
          <button onClick={logout} disabled={loading} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-sky-600 text-sky-700 hover:bg-sky-50 disabled:opacity-50">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm">
      <div className="mb-4 flex rounded-md overflow-hidden border w-max">
        <button onClick={() => { setMode('login'); setError(null); }} className={`px-3 py-1 text-sm ${mode==='login' ? 'bg-sky-600 text-white' : 'hover:bg-zinc-50'}`}>Login</button>
        <button onClick={() => { setMode('signup'); setError(null); }} className={`px-3 py-1 text-sm ${mode==='signup' ? 'bg-sky-600 text-white' : 'hover:bg-zinc-50'}`}>Signup</button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={onLogin} className="space-y-3">
          <h2 className="text-xl font-semibold">Log in</h2>
          <input
            required
            value={identifier}
            onChange={e=>setIdentifier(e.target.value)}
            placeholder="Email or username"
            className="w-full rounded border px-3 py-2 text-sm"
            autoComplete="username"
            suppressHydrationWarning
          />
          <input
            required
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded border px-3 py-2 text-sm"
            autoComplete="current-password"
            suppressHydrationWarning
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50">{loading? 'Logging in…' : 'Login'}</button>
        </form>
      ) : (
        <form onSubmit={onSignup} className="space-y-3">
          <h2 className="text-xl font-semibold">Create account</h2>
          <input
            required
            value={username}
            onChange={e=>setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded border px-3 py-2 text-sm"
            autoComplete="username"
            suppressHydrationWarning
          />
          <input
            required
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded border px-3 py-2 text-sm"
            autoComplete="email"
            suppressHydrationWarning
          />
          <input
            type="text"
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Full name (optional)"
            className="w-full rounded border px-3 py-2 text-sm"
            autoComplete="name"
            suppressHydrationWarning
          />
          <input
            required
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded border px-3 py-2 text-sm"
            autoComplete="new-password"
            suppressHydrationWarning
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50">{loading? 'Creating…' : 'Create account'}</button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
