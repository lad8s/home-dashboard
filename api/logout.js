// GET /api/logout: clear the session cookie and go back to the login page.
import { COOKIE } from '../lib/session.js';

export function GET() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/login',
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
