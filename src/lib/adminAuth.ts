import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 Stunden

export function isAdminAuthenticated(cookies: AstroCookies): boolean {
  const token = cookies.get(COOKIE_NAME)?.value;
  const secret = import.meta.env.ADMIN_SECRET;
  if (!secret || !token) return false;
  return token === secret;
}

export function setAdminCookie(cookies: AstroCookies, secret: string): void {
  cookies.set(COOKIE_NAME, secret, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function clearAdminCookie(cookies: AstroCookies): void {
  cookies.delete(COOKIE_NAME, { path: '/' });
}
