// Local preview without a Vercel account: node dev.mjs  →  http://localhost:3000
// Copies what Vercel does: reads .env, runs middleware.js, routes /api/*, serves public/ with clean URLs.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import middleware, { config } from './middleware.js';

const root = dirname(fileURLToPath(import.meta.url));
if (existsSync(join(root, '.env'))) {
  for (const line of readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const matcher = new RegExp(`^${config.matcher}$`);
const PORT = Number(process.env.PORT) || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const request = new Request(url, {
    method: req.method, headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
  });

  let response = matcher.test(url.pathname) ? await middleware(request) : undefined;

  if (!response && url.pathname.startsWith('/api/')) {
    const file = join(root, 'api', url.pathname.slice(5) + '.js');
    const mod = existsSync(file) ? await import(pathToFileURL(file)) : {};
    response = mod[req.method] ? await mod[req.method](request) : new Response('Not found', { status: 404 });
  }

  if (!response) {
    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = join(root, 'public', extname(path) ? path : path + '.html');
    response = existsSync(file)
      ? new Response(await readFile(file), { headers: { 'Content-Type': types[extname(file)] || 'application/octet-stream' } })
      : new Response('Not found', { status: 404 });
  }

  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
