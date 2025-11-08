import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSessionFromCookies } from '../../../lib/auth';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
  return NextResponse.json(orders.map((o: any) => ({
    id: o.id,
    email: o.email,
    name: o.name,
    address: o.address,
    total: Number(o.total),
    fulfilled: o.fulfilled,
    createdAt: o.createdAt,
    items: o.items.map((i: any) => ({ id: i.id, productId: i.productId, title: i.title, price: Number(i.price), quantity: i.quantity, image: i.image }))
  })));
}

export async function POST(req: Request) {
  const session = await getSessionFromCookies();
  const { email, name, address, items, total } = await req.json();
  if (!email || !items?.length) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const created = await prisma.order.create({
    data: {
      email,
      name,
      address,
      total,
      userId: session?.id,
      items: { create: (items as any[]).map((i: any) => ({ productId: i.product.id, title: i.product.title, price: i.product.price, quantity: i.qty, image: i.product.image })) }
    },
    include: { items: true }
  });
  return NextResponse.json({ id: created.id });
}
