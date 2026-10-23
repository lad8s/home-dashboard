// Vercel Routing Middleware: every page except the login page needs a valid session cookie.
import { COOKIE, readCookie, verifyToken } from './lib/session.js';

export const config = {
  matcher: '/((?!login|api/login|style\\.css|icons/|favicon).*)',
};

export default async function middleware(request) {
  const token = readCookie(request, COOKIE);
  if (await verifyToken(token, process.env.SESSION_SECRET)) return; // continue to the page
  return Response.redirect(new URL('/login', request.url), 307);
}
