"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CartSummary } from './CartSummary';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, total } = useCart();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setOpen(o => !o);
    window.addEventListener('cart:toggle', handler);
    return () => window.removeEventListener('cart:toggle', handler);
  }, []);
  return (
    <div aria-hidden={!open}>
      <div
        className={`fixed inset-y-0 right-0 z-40 w-80 transform bg-white shadow-xl transition-transform duration-300 border-l border-zinc-200 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Your Cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="rounded p-1 hover:bg-zinc-100">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <CartSummary />
        </div>
        <div className="border-t p-4 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
