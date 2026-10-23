// POST /api/login  (form fields: user, password)
// USERS env var: "name1:password1,name2:password2". Names are not case-sensitive.
import { COOKIE, MAX_AGE_DAYS, makeToken, safeEqual } from '../lib/session.js';

function redirect(location, cookie) {
  const headers = { Location: location };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(null, { status: 303, headers });
}

export async function POST(request) {
  const form = await request.formData();
  const user = String(form.get('user') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');

  let ok = false;
  for (const pair of (process.env.USERS || '').split(',')) {
    const cut = pair.indexOf(':');
    if (cut < 1) continue;
    const name = pair.slice(0, cut).trim().toLowerCase();
    const secret = pair.slice(cut + 1).trim();
    if (!secret) continue;
    // Check every pair (no early exit) so timing does not reveal valid names.
    if (safeEqual(name, user) & safeEqual(secret, password)) ok = true;
  }

  if (!ok || !process.env.SESSION_SECRET) {
    await new Promise(r => setTimeout(r, 1000)); // slow down guessing
    return redirect('/login?e=1');
  }

  const token = await makeToken(user, process.env.SESSION_SECRET);
  const maxAge = MAX_AGE_DAYS * 86400;
  return redirect('/', `${COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`);
}
