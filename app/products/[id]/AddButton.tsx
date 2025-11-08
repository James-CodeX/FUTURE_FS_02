"use client";
import React from 'react';
import { Product } from '../../../lib/types';
import { useCart } from '../../../context/CartContext';

export default function AddButton({ product }: { product: Product }) {
  const { dispatch, items } = useCart();
  const entry = items.find(i => i.product.id === product.id);
  const qty = entry?.qty || 0;
  if (qty === 0) {
    return (
      <button
        onClick={() => dispatch({ type: 'ADD', product })}
        className="inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      >
        Add to Cart
      </button>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => dispatch({ type: 'QTY', id: product.id, qty: qty - 1 })}
        className="h-9 w-9 rounded-md border border-zinc-300 text-base font-semibold flex items-center justify-center hover:bg-zinc-100"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm font-medium">{qty}</span>
      <button
        onClick={() => dispatch({ type: 'QTY', id: product.id, qty: qty + 1 })}
        className="h-9 w-9 rounded-md border border-zinc-300 text-base font-semibold flex items-center justify-center hover:bg-zinc-100"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
