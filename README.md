# home-dashboard

This is the page for **home.lad8s.com**. The page shows a large icon for each app on the home Raspberry Pi. A click on an icon opens the app.

The page has a login. Two users are set in Vercel. Nobody can create a new user.

The page is only a list of links. The Pi stays closed to the internet. A link works only on the home Wi-Fi or with Tailscale on.

## How the parts work

| Part | File | What it does |
|---|---|---|
| Login page | `public/login.html` | Shows the username and password fields. |
| Login check | `api/login.js` | Compares the username and password with the `USERS` variable. If they agree, it sets a signed cookie for 400 days. |
| Login renewal | `api/refresh.js` | Gives the browser a new 400-day cookie at each visit to the app page. |
| Log out | `api/logout.js` | Removes the cookie. |
| Gate | `middleware.js` | Sends a visitor without a valid cookie to the login page. The app list is behind this gate too. |
| Cookie signature | `lib/session.js` | Signs and checks the cookie with `SESSION_SECRET`. |
| App page | `public/index.html`, `public/style.css` | Shows the icon grid. "Daily" is at the top. "All apps" is below it. |
| App list and Pi addresses | `public/apps.js` | Holds the list of apps, their ports, and the two Pi addresses. |
| Icons | `public/icons/` | SVG icons from [homarr-labs/dashboard-icons](https://github.com/homarr-labs/dashboard-icons). |
| Local preview | `dev.mjs` | Runs the site on your PC without Vercel. |

The usernames and passwords are not in the code. They are only in Vercel (and in your local `.env` file, which git ignores).

## Home and Away

The switch at the top changes the address in every link.

| Switch | Address | When to use |
|---|---|---|
| Home | `192.168.1.194` (the Pi LAN address) | You are on the home Wi-Fi. |
| Away | `100.83.97.42` (the Pi Tailscale address) | You are out. Tailscale must be on. The Away links also work at home when Tailscale is on. |

The two addresses are in the `HOSTS` constant at the top of `public/apps.js`. If the Pi gets a new LAN address, change `HOSTS.home` there.

The page remembers the switch, and the light or dark mode, in the browser.

## Change the app list

1. Open `public/apps.js`.
2. Add, remove, or change a line in `APPS`. Set `daily: true` to put the app in the top section.
3. For a new icon, find the app name in [dashboard-icons](https://github.com/homarr-labs/dashboard-icons/tree/main/svg).
4. Save the SVG file in `public/icons/`.

## Run on your PC

You need Node.js 20 or later.

1. Copy `.env.example` to `.env`.
2. In `.env`, write two test logins and a random secret.
3. Run this command in this folder:

```powershell
node dev.mjs
```

4. Open http://localhost:3000.

## Rules for the logins

- Write the `USERS` variable as `name:password,name:password`.
- A password can use any character, but not a comma.
- The username is not case-sensitive. The password is case-sensitive.
- A wrong login waits 1 second before the error shows. This makes guessing slow.
- The browser or the phone can save the username and password. The login fields have the correct tags for a password manager.
- A login stays active for 400 days. Browsers do not keep a cookie for a longer time. Each visit starts the 400 days again. Thus a login ends only after 400 days with no visit.
- Use a password that is not a short number. A short number is easy to guess.

## Put the site on the internet (first time)

This uses free plans of GitHub and Vercel.

### 1. Make the GitHub repo

1. Open https://github.com/new.
2. Set the name to `home-dashboard`.
3. Select **Private**.
4. Do not add a README, a `.gitignore`, or a license. The repo must be empty.
5. Click **Create repository**.

### 2. Send the code to GitHub

Run these commands in this folder:

```powershell
git init -b main
git add .
git commit -m "First version of home.lad8s.com"
git remote add origin https://github.com/lad8s/home-dashboard.git
git push -u origin main
```

After this first push, make each change in a branch and a pull request.

### 3. Make the Vercel project

1. Open https://vercel.com/new.
2. Import the `lad8s/home-dashboard` repo.
3. Keep the framework as **Other**. Do not set a build command.
4. Open **Environment Variables**.
5. Add `USERS` with the two real logins.
6. Add `SESSION_SECRET` with 32 or more random characters.
7. Click **Deploy**.
8. Open the `*.vercel.app` address that Vercel shows. Make sure that the login works.

### 4. Connect home.lad8s.com

1. In the Vercel project, open **Settings → Domains**.
2. Add `home.lad8s.com`.
3. Vercel shows a CNAME record. Copy its value. The value is usually `cname.vercel-dns.com`.
4. Open the DNS records for lad8s.com at **Yandex**. The DNS is at Yandex, not at GoDaddy.
5. Add a record: type `CNAME`, name `home`, value from step 3.

**CAUTION:** Do not change the MX and TXT records. The email for lad8s.com uses them.

6. Wait until Vercel shows **Valid Configuration**. This can take from some minutes to some hours.
7. Vercel makes the HTTPS certificate automatically.
8. Open https://home.lad8s.com.

A subdomain is only one DNS record. Thus lad8s.com and home.lad8s.com can go to two different Vercel projects and two different repos.

## Change the logins later

1. In Vercel, open **Settings → Environment Variables**.
2. Change `USERS`.
3. Open **Deployments** and click **Redeploy** on the latest deployment.

To log out every device, change `SESSION_SECRET` and redeploy.

## Related

- [home pi index](../index.md): all the apps on the Pi and their ports.
- [lad8s-site](../../personal/lad8s-site/index.md): the main site lad8s.com and the domain details.


---

## Resume This Conversation

```powershell
cd C:\Users\lados\Documents\Code\claude ; claude --resume a304576b-92f1-48f2-8c32-2b9f6c0c6a0f
```
