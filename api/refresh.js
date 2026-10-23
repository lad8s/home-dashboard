// GET /api/refresh: give a logged-in browser a fresh 400-day cookie.
// middleware.js has already rejected requests without a valid cookie.
import { COOKIE, makeToken, readCookie, sessionCookie, verifyToken } from '../lib/session.js';

export async function GET(request) {
  const secret = process.env.SESSION_SECRET;
  const user = await verifyToken(readCookie(request, COOKIE), secret);
  if (!user) return new Response(null, { status: 401 });
  return new Response(null, {
    status: 204,
    headers: { 'Set-Cookie': sessionCookie(await makeToken(user, secret)), 'Cache-Control': 'no-store' },
  });
}
