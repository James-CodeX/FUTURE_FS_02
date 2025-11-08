import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signSession, setAuthCookie } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, username, password, name } = await req.json();
    if (!email || !username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, username, password: hashed, name } });
    const token = signSession({ id: user.id, role: user.role, email: user.email, username: user.username });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    res.cookies.set(setAuthCookie(token));
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
