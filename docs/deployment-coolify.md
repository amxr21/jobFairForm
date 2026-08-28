# Deploying to Hostinger VPS + Coolify

Both services deploy from this one repository as **two separate Coolify
applications**, distinguished by their Base Directory. Assumes the VPS is
provisioned and Coolify is installed.

Target hosts:

| Service  | Base Directory | Dockerfile Location | Domain                       | Port |
|----------|----------------|---------------------|------------------------------|------|
| Frontend | `/frontend`    | `/Dockerfile`       | `https://form.amxr.site`     | 80   |
| Backend  | `/backend`     | `/Dockerfile`       | `https://api.form.amxr.site` | 2001 |

Both use the **Dockerfile** build pack — the Dockerfiles are committed, so
build steps live in the repo and do not need to be re-entered in the UI.

> **Dockerfile Location is relative to the Base Directory, not the repo root.**
> Coolify concatenates the two, so setting it to `/backend/Dockerfile` alongside
> a `/backend` base directory resolves to `backend/backend/Dockerfile` and the
> build fails with `lstat .../backend/backend: no such file or directory`.
> It is `/Dockerfile` for both apps.

Leave **Build Command** and **Start Command** empty. They live in the
Dockerfiles; filling them in the UI overrides what the repo specifies.

---

## 1. DNS

`form.amxr.site` is covered by the wildcard `A` record (`*` → server IP).

**`api.form.amxr.site` is not.** A DNS wildcard matches exactly one label, so
`*.amxr.site` covers `form.amxr.site` but not the two-level
`api.form.amxr.site`. That needs its own record:

| Type | Name           | Value       |
|------|----------------|-------------|
| A    | `api.form`     | server IP   |

(A `*.form` wildcard would work too if more sub-subdomains are coming.)

Confirm both resolve before adding the domains in Coolify — Let's Encrypt
validates over HTTP, so a name that does not resolve fails cert issuance and
the app comes up without TLS:

```bash
dig +short form.amxr.site       # expect the server IP
dig +short api.form.amxr.site
```

On Cloudflare, records must be **DNS only** (grey cloud), not proxied.

## 2. Database

Use the **shared MySQL** resource — one engine, one logical database per app.
Do not create a new MySQL resource for this app.

In the MySQL container's terminal, as root:

```sql
CREATE DATABASE jobfair CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jobfair'@'%' IDENTIFIED BY 'CHOOSE_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON jobfair.* TO 'jobfair'@'%';
FLUSH PRIVILEGES;
```

> The dashboard app (repo `amxr21/jobFair`) uses this **same** database.
> Point it at this one too, or the two apps will diverge.

**The database host is the container UUID**, not the friendly resource name.
Reveal it with the eye icon on the database's internal connection URL. Using
the display name fails at runtime with `EAI_AGAIN`.

No TLS is needed here: traffic stays on Coolify's internal Docker network and
never crosses the public internet. `config/prisma.js` only enables SSL when the
URL requests it or `DB_CA_CERT*` is set, so a plain internal URL passes through
untouched — leave those variables unset. (They exist for the previous
Aiven-hosted setup.)

## 3. Backend application

**New → Application → Private Repository (GitHub App) → this repo.**

- Base Directory: `/backend`
- Dockerfile Location: `/Dockerfile` (relative to the base directory — see above)
- Build Pack: **Dockerfile**
- Ports Exposes: `2001`
- Domain: `https://api.form.amxr.site`

Environment variables (runtime):

```
DATABASE_URL=mysql://jobfair:PASSWORD@<CONTAINER_UUID>:3306/jobfair
ALLOWED_ORIGINS=https://form.amxr.site
TOKEN_SIGN=<random 32+ byte string, unique to this app>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Notes:

- Percent-encode special characters in the password (`@` → `%40`), or the
  URL parser mis-reads the host.
- `TOKEN_SIGN` must be random bytes generated for this deployment — not a
  secret copied from another service. Generate one with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `ALLOWED_ORIGINS` is comma-separated and supplements the built-in localhost
  dev origins. It must contain the **exact** frontend origin, with scheme and
  no trailing slash, or the browser blocks every request.
- `DATABASE_URL` is needed at runtime only. The image builds without it —
  `prisma.config.cjs` falls back to a placeholder so `prisma generate` (run by
  `postinstall`) never needs a live database.

## 4. Load the schema

Only on a fresh database, from the **backend** container's terminal. The
authoritative `schema.sql` lives in the dashboard repo — see
`backend/prisma/SCHEMA.md` for why, and do not run `prisma db push` here.

```bash
curl -fsSL -o /tmp/schema.sql \
  https://raw.githubusercontent.com/amxr21/jobFair/main/backend/migrations/schema.sql

node scripts/load-schema.js /tmp/schema.sql --stop-on-error
```

Expect 21 statements to succeed (19 tables). Then verify the app's own
connection:

```bash
node -e "require('./config/prisma').\$queryRaw\`SELECT 1\`.then(r=>{console.log('ok',r);process.exit(0)}).catch(e=>{console.error(e.message);process.exit(1)})"
```

## 5. Frontend application

**New → Application → same repository.**

- Base Directory: `/frontend`
- Dockerfile Location: `/Dockerfile` (relative to the base directory — see above)
- Build Pack: **Dockerfile**
- Ports Exposes: `80`
- Domain: `https://form.amxr.site`

Environment variable — **must be marked as a Build Variable**:

```
VITE_API_URL=https://api.form.amxr.site
```

Vite inlines this into the bundle at build time, so:

- Changing it requires a **redeploy**, not a restart.
- A runtime-only variable has no effect whatsoever.
- No trailing slash — it is concatenated with paths, and a slash produces `//`.

The build **fails deliberately** if this is unset. That is the Dockerfile
guarding against a build that would otherwise succeed and ship a page that
breaks on load.

## 6. Verify

```bash
curl -s https://api.form.amxr.site/health          # {"status":"ok",...}
curl -sI https://form.amxr.site/my-qr-code | head -1   # HTTP/2 200, not 404
```

The second check matters: it confirms nginx's SPA fallback is working. The app
uses `BrowserRouter`, and `/my-qr-code` has no file on disk — a 404 there means
the rewrite is not in effect. (`vercel.json` handled this on Vercel and is
ignored everywhere else.)

Then submit a real form end to end — it exercises CORS, the database write, the
Cloudinary upload, and ticket generation in one pass.

## 7. Resource limits

On a 4 GB box, cap each app (Configuration → Advanced → Resource Limits):
frontend `--memory=256m` (nginx serving static files needs little), backend
`--memory=384m`. Keep the total plus MySQL and Coolify's ~1 GB overhead under
about 3.5 GB.

Never run both builds at once on 1 vCPU.

---

## Migrating from the current Aiven database

The form and dashboard **share one database**, and the dashboard is live against
Aiven. Moving only this app creates two diverging copies. Either migrate both
together, or leave `DATABASE_URL` pointing at Aiven (with `DB_CA_CERT` set to
the CA contents) until the dashboard is ready to move.

To move the data, from a machine with the Aiven credentials:

```bash
mysqldump --single-transaction --set-gtid-purged=OFF \
  -h <aiven-host> -P <port> -u <user> -p --ssl-ca=ca.pem jobfair > jobfair-dump.sql
```

Load it with the same statement-splitting script, and verify row counts on both
sides before switching either app over.
