// Pi addresses. This is the only place they are written.
// home = the Pi on the home Wi-Fi (LAN). away = the Pi over Tailscale.
const HOSTS = {
  home: '192.168.1.194',
  away: '100.83.97.42',
};

// daily: true → top section. Everything else → "All apps".
// path (optional) → the page to open inside the app, for example Nextcloud Files.
const APPS = [
  { name: 'Nextcloud',    port: 8080, icon: 'nextcloud',    daily: true, path: '/apps/files/files' },
  { name: 'TriliumNext',  port: 8075, icon: 'triliumnext',  daily: true },
  { name: 'Donetick',     port: 8085, icon: 'donetick',     daily: true },
  { name: 'KitchenOwl',   port: 8095, icon: 'kitchenowl',   daily: true },
  { name: 'Jellyfin',     port: 8096, icon: 'jellyfin',     daily: true },
  { name: 'Seerr',        port: 5055, icon: 'seerr',        daily: true },
  { name: 'Firefly III',  port: 9090, icon: 'firefly-iii' },
  { name: 'Firefly Importer', port: 9091, icon: 'firefly-iii' },
  { name: 'qBittorrent',  port: 8090, icon: 'qbittorrent' },
  { name: 'Radarr',       port: 7878, icon: 'radarr' },
  { name: 'Sonarr',       port: 8989, icon: 'sonarr' },
  { name: 'Bazarr',       port: 6767, icon: 'bazarr' },
  { name: 'Prowlarr',     port: 9696, icon: 'prowlarr' },
  { name: 'FlareSolverr', port: 8191, icon: 'flaresolverr' },
];

const $ = sel => document.querySelector(sel);

function render() {
  const mode = localStorage.getItem('mode') || 'home';
  const host = HOSTS[mode];
  for (const btn of document.querySelectorAll('[data-mode]')) {
    btn.setAttribute('aria-pressed', btn.dataset.mode === mode);
  }
  const tile = app => `
    <a class="app" href="http://${host}:${app.port}${app.path || '/'}">
      <span class="icon"><img src="/icons/${app.icon}.svg" alt=""></span>
      <span class="label">${app.name}</span>
    </a>`;
  $('#daily').innerHTML = APPS.filter(a => a.daily).map(tile).join('');
  $('#all').innerHTML = APPS.filter(a => !a.daily).map(tile).join('');
  $('#where').textContent = mode === 'home' ? 'On the home Wi-Fi' : 'Over Tailscale';
}

for (const btn of document.querySelectorAll('[data-mode]')) {
  btn.addEventListener('click', () => { localStorage.setItem('mode', btn.dataset.mode); render(); });
}

$('#theme').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
});

render();
fetch('/api/refresh'); // renew the login on each visit
