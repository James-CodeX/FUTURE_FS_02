import { prisma } from '../../lib/prisma';
import { getSessionFromCookies } from '../../lib/auth';
import { redirect } from 'next/navigation';
import FulfillButton from './FulfillButton';

export default async function AdminPage() {
  const session = await getSessionFromCookies();
  // If not authenticated, send to login and return here after
  if (!session) redirect('/login?redirect=/admin');
  // If authenticated but not an admin, block access
  if (session.role !== 'ADMIN') redirect('/');
  const users = await prisma.user.findMany({ select: { id: true, email: true, username: true, role: true, createdAt: true } });
  const orders = await prisma.order.findMany({ include: { items: true, user: { select: { username: true } } }, orderBy: { createdAt: 'desc' }, take: 50 });
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <section>
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <table className="w-full text-sm border border-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
        <div className="space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="rounded border border-zinc-200 p-4 text-xs space-y-2 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order #{o.id}</span>
                <span className={`rounded px-2 py-0.5 ${o.fulfilled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.fulfilled ? 'Fulfilled' : 'Pending'}</span>
              </div>
              <div className="flex justify-between"><span>{new Date(o.createdAt).toLocaleString()}</span><span className="font-semibold">${Number(o.total).toFixed(2)}</span></div>
              <div>User: {o.user?.username || 'Guest'} | Email: {o.email}</div>
              <ul className="list-disc pl-5 space-y-1">
                {o.items.map((i: any) => <li key={i.id}>{i.quantity}× {i.title} (${Number(i.price).toFixed(2)})</li>)}
              </ul>
              {!o.fulfilled && (
                <FulfillButton orderId={o.id} />
              )}
            </div>
          ))}
          {!orders.length && <p className="text-zinc-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  );
}
