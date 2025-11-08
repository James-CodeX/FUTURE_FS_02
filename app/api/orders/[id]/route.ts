import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true, user: true } });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (order.userId !== session.id && session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({
    id: order.id,
    email: order.email,
    name: order.name,
    address: order.address,
    total: Number(order.total),
    fulfilled: order.fulfilled,
    createdAt: order.createdAt,
    items: order.items.map((i: any) => ({ id: i.id, productId: i.productId, title: i.title, price: Number(i.price), quantity: i.quantity, image: i.image }))
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  let body: any = {};
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await req.json().catch(() => ({}));
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData();
    const fulfilledValue = formData.get('fulfilled');
    if (fulfilledValue === 'true') body.fulfilled = true;
    if (fulfilledValue === 'false') body.fulfilled = false;
  }
  if (typeof body.fulfilled !== 'boolean') {
    // default fulfillment toggle if none provided
    const existing = await prisma.order.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    body.fulfilled = !existing.fulfilled;
  }
  const updated = await prisma.order.update({ where: { id: Number(id) }, data: { fulfilled: body.fulfilled } });
  return NextResponse.json({ id: updated.id, fulfilled: updated.fulfilled });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // Support HTML form submissions from the admin page to toggle fulfillment
  return PATCH(req, ctx);
}
