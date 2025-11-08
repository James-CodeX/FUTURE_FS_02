import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { getSessionFromCookies } from '../../../lib/auth';

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) notFound();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true } });
  if (!order || (order.userId !== session.id && session.role !== 'ADMIN')) notFound();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Order #{order.id}</h1>
        <span className={`text-xs rounded px-2 py-0.5 ${order.fulfilled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.fulfilled ? 'Fulfilled' : 'Pending'}</span>
      </div>
      <div className="text-sm text-zinc-600">Placed {new Date(order.createdAt).toLocaleString()}</div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <ul className="text-sm list-disc pl-5 space-y-1">
          {order.items.map((i: any) => (
            <li key={i.id}>{i.quantity} × {i.title} (${Number(i.price).toFixed(2)})</li>
          ))}
        </ul>
        <div className="mt-4 text-right text-lg font-semibold">Total: ${Number(order.total).toFixed(2)}</div>
      </div>
    </div>
  );
}
