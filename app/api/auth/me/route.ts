import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionFromCookies } from '../../../../lib/auth';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { id: true, email: true, username: true, role: true, name: true } });
  return NextResponse.json({ user });
}
