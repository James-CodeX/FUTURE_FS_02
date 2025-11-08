"use client";
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CartItem, Product, Order } from '../lib/types';

interface State { items: CartItem[]; orders: Order[]; }
const initial: State = { items: [], orders: [] };

type Action =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'QTY'; id: number; qty: number }
  | { type: 'CLEAR' }
  | { type: 'ORDER' }
  | { type: 'HYDRATE'; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      return existing
        ? { ...state, items: state.items.map(i => i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) }
        : { ...state, items: [...state.items, { product: action.product, qty: 1 }] };
    }
    case 'REMOVE': return { ...state, items: state.items.filter(i => i.product.id !== action.id) };
    case 'QTY': {
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.product.id !== action.id) };
      return { ...state, items: state.items.map(i => i.product.id === action.id ? { ...i, qty: action.qty } : i) };
    }
    case 'CLEAR': return { ...state, items: [] };
    case 'ORDER': {
      if (!state.items.length) return state;
      const total = state.items.reduce((t, i) => t + i.product.price * i.qty, 0);
      const order: Order = { id: crypto.randomUUID(), items: state.items, total, createdAt: new Date().toISOString() };
      return { items: [], orders: [order, ...state.orders] };
    }
    case 'HYDRATE': return action.state;
    default: return state;
  }
}

const CartCtx = createContext<ReturnType<typeof useCartInternal> | null>(null);
function useCartInternal() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage AFTER mount to keep server/client first render identical
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('cartState');
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist once mounted
  useEffect(() => {
    if (mounted) localStorage.setItem('cartState', JSON.stringify(state));
  }, [state, mounted]);
  const total = state.items.reduce((t, i) => t + i.product.price * i.qty, 0);
  return { ...state, total, dispatch };
}
export const CartProvider = ({ children }: { children: React.ReactNode }) => <CartCtx.Provider value={useCartInternal()}>{children}</CartCtx.Provider>;
export function useCart() { const v = useContext(CartCtx); if (!v) throw new Error('CartContext'); return v; }
