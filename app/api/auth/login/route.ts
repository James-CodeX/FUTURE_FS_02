import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signSession, setAuthCookie, clearAuthCookie } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const token = signSession({ id: user.id, role: user.role, email: user.email, username: user.username });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    res.cookies.set(setAuthCookie(token));
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() { // logout
  const res = NextResponse.json({ success: true });
  res.cookies.set(clearAuthCookie());
  return res;
}
