// Signed session cookie, shared by middleware.js (Edge) and api/login.js (Node).
// Uses Web Crypto only, so the same code runs in both runtimes.

export const COOKIE = 'session';
export const MAX_AGE_DAYS = 30;

const enc = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compare two strings without leaking where they differ.
export function safeEqual(a, b) {
  a = String(a); b = String(b);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

// Token format: <user>.<expiry ms>.<hmac hex>
export async function makeToken(user, secret) {
  const exp = Date.now() + MAX_AGE_DAYS * 864e5;
  const payload = `${encodeURIComponent(user)}.${exp}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const cut = token.lastIndexOf('.');
  if (cut < 0) return false;
  const payload = token.slice(0, cut);
  const exp = Number(payload.slice(payload.lastIndexOf('.') + 1));
  if (!exp || exp < Date.now()) return false;
  return safeEqual(token.slice(cut + 1), await hmac(secret, payload));
}

export function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}
