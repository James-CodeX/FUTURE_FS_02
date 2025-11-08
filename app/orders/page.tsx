"use client";
import React, { useEffect, useState } from 'react';

type DbOrder = {
  id: number; total: number; createdAt: string; fulfilled?: boolean; items: { id: number; title: string; price: number; quantity: number }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<DbOrder[] | null>(null);
  useEffect(() => {
    fetch('/api/orders').then(async r => {
      if (r.status === 401) { setOrders([]); return; }
      const data = await r.json(); setOrders(data);
    }).catch(() => setOrders([]));
  }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order History</h2>
      {orders === null && <p className="text-sm text-slate-500">Loading…</p>}
      {orders && !orders.length && <p className="text-sm text-slate-500">No orders yet.</p>}
      <ul className="space-y-3">
        {orders?.map(o => (
          <li key={o.id} className="rounded-lg border border-zinc-200 bg-white shadow-sm p-4">
            <div className="flex justify-between text-sm mb-2">
              <a href={`/orders/${o.id}`} className="text-sky-700 hover:underline">Order #{o.id}</a>
              <div className="flex items-center gap-3">
                <span className={`text-xs rounded px-2 py-0.5 ${o.fulfilled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.fulfilled ? 'Fulfilled' : 'Pending'}</span>
                <span className="font-medium">${o.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-xs text-zinc-500 mb-2">{new Date(o.createdAt).toLocaleString()}</div>
            <ul className="text-xs list-disc pl-5 space-y-1">
              {o.items.map(i => <li key={i.id}>{i.quantity} × {i.title}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
