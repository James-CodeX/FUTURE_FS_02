import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'auth';
const SECRET = process.env.AUTH_SECRET || 'dev-secret';
const IS_PROD = process.env.NODE_ENV === 'production';

export interface SessionPayload { id: number; role: 'USER' | 'ADMIN'; email: string; username: string; }

export function signSession(p: SessionPayload) {
  return jwt.sign(p, SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string): SessionPayload | null {
  try { return jwt.verify(token, SECRET) as SessionPayload; } catch { return null; }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: IS_PROD, // allow non-secure in dev so cookies work on http://localhost
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
