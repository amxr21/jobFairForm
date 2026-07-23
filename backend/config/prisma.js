const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

// Aiven (and most managed MySQL) require TLS. Enable SSL when the connection
// string asks for it, or when a CA cert path is provided.
const rawUrl = process.env.DATABASE_URL || "";
const wantsSsl =
  /ssl-mode=REQUIRED/i.test(rawUrl) || Boolean(process.env.DB_CA_CERT_PATH);

let poolConfig = rawUrl;

if (wantsSsl) {
  const caPath = process.env.DB_CA_CERT_PATH;
  const caExists = caPath && fs.existsSync(caPath);

  // certs/ is gitignored, so ca.pem is never present on a host that deploys
  // from git (Render). DB_CA_CERT reads the certificate's *contents* straight
  // from an env var, which is how a managed host can supply it without a file.
  const caInline = process.env.DB_CA_CERT;

  let ssl;
  if (caInline) {
    ssl = { ca: caInline, rejectUnauthorized: true };
  } else if (caExists) {
    ssl = { ca: fs.readFileSync(caPath), rejectUnauthorized: true };
  } else {
    // Neither form of the CA is available. Keeping rejectUnauthorized:true
    // here guarantees a handshake failure — the driver has nothing to verify
    // against — which surfaces as "pool timeout: ... active=0 idle=0" after
    // 30s rather than a TLS error, making it look like a network problem.
    //
    // Aiven's certificate chains to a public root, so Node's built-in CA
    // bundle can verify it. Prefer that over disabling verification.
    if (caPath) {
      console.warn(
        `DB_CA_CERT_PATH is set to "${caPath}" but that file was not found, ` +
          `and DB_CA_CERT is empty. Falling back to Node's built-in CA bundle. ` +
          `Set DB_CA_CERT to the contents of ca.pem to pin Aiven's CA explicitly.`
      );
    }
    ssl = { rejectUnauthorized: process.env.DB_SSL_INSECURE !== "true" };
  }

  // The mariadb PoolConfig has no `url` field, so the connection string must
  // be broken into discrete fields to attach `ssl` alongside them.
  //
  // `new URL("")` throws TypeError at MODULE LOAD time, which happens before
  // app.js can mount any routes — so a missing/blank DATABASE_URL (with
  // DB_CA_CERT_PATH set) would kill the process at startup with an opaque
  // "Invalid URL". Fail with a message that names the actual problem.
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL is not set. The database connection cannot be configured — " +
        "set it in the deployment's environment variables."
    );
  }
  const parsed = new URL(rawUrl);
  poolConfig = {
    host: parsed.hostname,
    port: Number(parsed.port),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
    ssl,
    // Cross-region latency (e.g. Render US/EU ↔ Aiven Bangalore) pushes the
    // TLS + auth handshake past the driver's 1s default connectTimeout, so
    // the pool never gets a single connection and times out generically.
    connectTimeout: 15000,
    // acquireTimeout is the pool's own deadline for handing a connection to a
    // query (default 10s). It must exceed connectTimeout, otherwise the pool
    // reports "failed to retrieve a connection from pool after 10000ms" while
    // the first connection attempt is still mid-handshake.
    acquireTimeout: 30000,
  };
}

const adapter = new PrismaMariaDb(poolConfig);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
module.exports.poolConfig = poolConfig;
