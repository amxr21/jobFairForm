/**
 * Env for MySQL integration tests — set BEFORE any app module is imported
 * (jest setupFiles). This app has no demo/in-memory mode (unlike
 * apps/dashboard/backend), so this is the only automated test path.
 * Opt-in (npm run test:mysql), never run by default, and guarded to a
 * SEPARATE database (jobfair_test) — never run these against a
 * DATABASE_URL pointing at real data.
 */
process.env.NODE_ENV = "test";
process.env.TOKEN_SIGN = "test-secret-please-ignore-1234567890";

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes("jobfair_test")) {
    throw new Error(
        "MySQL integration tests require DATABASE_URL to point at a database " +
        "named jobfair_test (a name containing 'jobfair_test'), as a guard " +
        "against accidentally running destructive tests against real data. " +
        "Set it in your shell before running: npm run test:mysql"
    );
}
