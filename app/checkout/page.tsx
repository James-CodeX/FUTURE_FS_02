"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CartSummary } from '../../components/CartSummary';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { dispatch, items, total } = useCart();
  const [placed, setPlaced] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lockedEmail, setLockedEmail] = useState(false);
  const [address, setAddress] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setName(d.user.name || d.user.username || '');
          setEmail(d.user.email || '');
          setLockedEmail(true); // logged in users email is trusted & immutable at checkout
        }
      })
      .catch(() => {});
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, address, items, total })
    })
      .then(async r => {
        if (!r.ok) throw new Error('Order failed');
        dispatch({ type: 'ORDER' });
        setPlaced(true);
        setTimeout(() => router.push('/orders'), 800);
      })
      .catch(() => setPlaced(true));
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <CartSummary />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Checkout</h2>
        {!lockedEmail && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <p>
              Tip: <a href="/login?redirect=/checkout" className="underline font-medium">Log in</a> to link this order to your account so you can view it later in Orders.
            </p>
          </div>
        )}
        {placed ? (
          <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm">Order placed! View it in Orders.</div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full rounded border px-3 py-2 text-sm" />
            <input required type="email" value={email} onChange={e=>!lockedEmail && setEmail(e.target.value)} placeholder="Email" disabled={lockedEmail} className="w-full rounded border px-3 py-2 text-sm disabled:bg-zinc-100" />
            <input required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="w-full rounded border px-3 py-2 text-sm" />
            <input required pattern="[0-9]{16}" placeholder="Card Number (16 digits)" className="w-full rounded border px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <input required pattern="[0-9]{2}/[0-9]{2}" placeholder="MM/YY" className="w-full rounded border px-3 py-2 text-sm" />
              <input required pattern="[0-9]{3}" placeholder="CVV" className="w-full rounded border px-3 py-2 text-sm" />
            </div>
            <button
              disabled={!items.length}
              className="inline-flex w-full items-center justify-center rounded-md px-4 py-2 font-medium transition bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Pay ${total.toFixed(2)}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
