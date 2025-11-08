"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch, items } = useCart();
  const entry = items.find(i => i.product.id === product.id);
  const qty = entry?.qty || 0;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <Link href={`/products/${product.id}`} className="flex-1">
        <div className="aspect-square relative mb-3">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <h3 className="font-semibold line-clamp-2 mb-1 text-sm">{product.title}</h3>
        <p className="text-sky-700 font-medium">${product.price.toFixed(2)}</p>
      </Link>
      {qty === 0 ? (
        <button
          onClick={() => dispatch({ type: 'ADD', product })}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium transition bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 mt-3"
        >
          Add to Cart
        </button>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            onClick={() => dispatch({ type: 'QTY', id: product.id, qty: qty - 1 })}
            className="h-8 w-8 rounded-md border border-zinc-300 text-sm font-semibold flex items-center justify-center hover:bg-zinc-100"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <div className="flex-1 text-center text-xs font-medium">
            {qty}
          </div>
          <button
            onClick={() => dispatch({ type: 'QTY', id: product.id, qty: qty + 1 })}
            className="h-8 w-8 rounded-md border border-zinc-300 text-sm font-semibold flex items-center justify-center hover:bg-zinc-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
