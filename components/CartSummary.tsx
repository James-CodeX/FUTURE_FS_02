"use client";
import React from 'react';
import { useCart } from '../context/CartContext';

export function CartSummary() {
  const { items, total, dispatch } = useCart();
  if (!items.length) return <p className="text-sm text-slate-500">Cart empty.</p>;
  return (
    <div className="space-y-3">
      {items.map(i => (
        <div key={i.product.id} className="flex items-center justify-between gap-2 text-sm">
          <span className="flex-1 line-clamp-1">{i.product.title}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch({ type: 'QTY', id: i.product.id, qty: i.qty - 1 })}
              className="h-6 w-6 rounded border border-zinc-300 text-xs font-semibold flex items-center justify-center hover:bg-zinc-100"
              aria-label={`Decrease ${i.product.title}`}
            >
              −
            </button>
            <span className="w-6 text-center text-xs">{i.qty}</span>
            <button
              onClick={() => dispatch({ type: 'QTY', id: i.product.id, qty: i.qty + 1 })}
              className="h-6 w-6 rounded border border-zinc-300 text-xs font-semibold flex items-center justify-center hover:bg-zinc-100"
              aria-label={`Increase ${i.product.title}`}
            >
              +
            </button>
          </div>
          <span>${(i.product.price * i.qty).toFixed(2)}</span>
          <button
            onClick={() => dispatch({ type: 'REMOVE', id: i.product.id })}
            className="rounded px-1 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            aria-label={`Remove ${i.product.title}`}
          >
            ×
          </button>
        </div>
      ))}
      <div className="flex justify-between border-t pt-2 font-medium">
        <span>Total</span><span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
