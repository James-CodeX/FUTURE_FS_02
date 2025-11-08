"use client";
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export function CartIconButton() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const count = mounted ? items.reduce((t, i) => t + i.qty, 0) : 0;
  const [open, setOpen] = useState(false);
  // We'll emit a custom event to toggle drawer from other components if needed.
  function toggle() {
    setOpen(o => !o);
    window.dispatchEvent(new CustomEvent('cart:toggle'));
  }
  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center rounded-md border border-sky-600 px-3 py-1 text-sm font-medium text-sky-700 hover:bg-sky-50"
      aria-label="Open cart"
    >
      Cart
      {mounted && count > 0 && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
