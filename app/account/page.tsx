import { getSessionFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSessionFromCookies();
  if (!session) {
    return (
      <div className="space-y-3">
        <p className="text-sm">You need to log in to view your account.</p>
        <Link href="/login?redirect=/account" className="inline-flex items-center justify-center rounded-md border border-sky-600 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50">Login / Signup</Link>
      </div>
    );
  }
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { id: true, email: true, username: true, role: true, name: true, createdAt: true } });
  const orderCount = await prisma.order.count({ where: { userId: session.id } });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Account</h2>
      <div className="rounded-lg border p-4 bg-white">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-zinc-500">Name</dt>
            <dd className="text-sm font-medium">{user?.name || user?.username}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Email</dt>
            <dd className="text-sm font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Username</dt>
            <dd className="text-sm font-medium">{user?.username}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Role</dt>
            <dd className="text-sm font-medium">{user?.role}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Member Since</dt>
            <dd className="text-sm font-medium">{user?.createdAt.toLocaleDateString?.() || new Date(user!.createdAt as unknown as string).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Orders</dt>
            <dd className="text-sm font-medium">{orderCount}</dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-2">
        <Link href="/orders" className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50">View Orders</Link>
        {user?.role === 'ADMIN' && (
          <Link href="/admin" className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50">Admin</Link>
        )}
      </div>
    </div>
  );
}
