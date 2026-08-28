#!/usr/bin/env node
/*
 * load-schema.js — load a .sql file into MySQL one statement at a time.
 *
 * WHY THIS EXISTS
 * The deployed container has no `mysql` client, so `mysql < schema.sql` is not
 * available. This script uses the `mariadb` driver the app already ships with
 * (a direct dependency of @prisma/adapter-mariadb, so it is always installed),
 * splits the file into individual statements, and runs them sequentially,
 * awaiting each one — no multi-statement query, no fixed sleeps.
 *
 * It reads DATABASE_URL, the same variable the app connects with, so it cannot
 * drift from the live connection the way a separate set of DB_* vars would.
 *
 * USAGE (from the backend container's terminal):
 *   node scripts/load-schema.js prisma/schema.sql
 *   node scripts/load-schema.js prisma/schema.sql --stop-on-error
 *
 * SAFETY: this executes every statement in the file. Review the file first and
 * back up anything with data in it. DDL auto-commits in MySQL, so a failed run
 * cannot be rolled back — re-running is only safe because schema.sql uses
 * IF NOT EXISTS guards.
 */

const fs = require("fs");

let mariadb;
try {
    mariadb = require("mariadb");
} catch (e) {
    console.error(
        "The 'mariadb' driver was not found. Run this from the BACKEND container " +
        "(it ships the driver via @prisma/adapter-mariadb), not the database container."
    );
    process.exit(1);
}

const file = process.argv[2] || "prisma/schema.sql";
const stopOnError = process.argv.includes("--stop-on-error");

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
    console.error("DATABASE_URL is not set. Run this inside the deployed backend container.");
    process.exit(1);
}

if (!fs.existsSync(file)) {
    console.error(`SQL file not found: ${file}`);
    process.exit(1);
}

/*
 * Split on semicolons, but only those that actually terminate a statement —
 * a semicolon inside a string literal or a comment must not split anything.
 * Tracks quote state (with backslash escapes), line comments (-- and #), and
 * block comments. The schema has no triggers or procedures, so DELIMITER
 * blocks are not handled; add that here if one is ever introduced.
 */
function splitStatements(sql) {
    const statements = [];
    let current = "";
    let quote = null;
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = 0; i < sql.length; i++) {
        const ch = sql[i];
        const next = sql[i + 1];

        if (inLineComment) {
            if (ch === "\n") inLineComment = false;
            current += ch;
            continue;
        }

        if (inBlockComment) {
            current += ch;
            if (ch === "*" && next === "/") {
                current += next;
                i++;
                inBlockComment = false;
            }
            continue;
        }

        if (quote) {
            current += ch;
            // A backslash escapes the next character, so a quote right after
            // one does not close the string.
            if (ch === "\\") {
                if (next !== undefined) {
                    current += next;
                    i++;
                }
                continue;
            }
            if (ch === quote) quote = null;
            continue;
        }

        if (ch === "'" || ch === '"' || ch === "`") {
            quote = ch;
            current += ch;
            continue;
        }

        if (ch === "-" && next === "-") {
            inLineComment = true;
            current += ch;
            continue;
        }

        if (ch === "#") {
            inLineComment = true;
            current += ch;
            continue;
        }

        if (ch === "/" && next === "*") {
            inBlockComment = true;
            current += ch;
            continue;
        }

        if (ch === ";") {
            const trimmed = current.trim();
            if (trimmed) statements.push(trimmed);
            current = "";
            continue;
        }

        current += ch;
    }

    const tail = current.trim();
    if (tail) statements.push(tail);

    // Drop chunks that are only comments/whitespace — they are not executable.
    return statements.filter((s) => {
        const stripped = s
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*(--|#).*$/gm, "")
            .trim();
        return stripped.length > 0;
    });
}

// Statements keep the comments that preceded them, so labelling naively would
// print a comment banner instead of the statement for almost every line.
function label(statement) {
    const code = statement
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*(--|#).*$/gm, "")
        .replace(/\s+/g, " ")
        .trim();
    return (code || statement.replace(/\s+/g, " ").trim()).slice(0, 70);
}

async function main() {
    const sql = fs.readFileSync(file, "utf8");
    const statements = splitStatements(sql);
    console.log(`Loading ${file} — ${statements.length} statements.`);

    // The schema file opens with CREATE DATABASE / USE, so connect without a
    // database selected and let the file choose it. Parsing the URL rather than
    // passing it through is what lets the database name be dropped.
    const parsed = new URL(rawUrl);
    const conn = await mariadb.createConnection({
        host: parsed.hostname,
        port: Number(parsed.port) || 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        multipleStatements: false,
        connectTimeout: 15000,
    });

    let ok = 0;
    const failures = [];

    try {
        for (const [index, statement] of statements.entries()) {
            try {
                await conn.query(statement);
                ok++;
                console.log(`  [${index + 1}/${statements.length}] ok: ${label(statement)}`);
            } catch (err) {
                failures.push({ index: index + 1, statement: label(statement), message: err.message });
                console.error(`  [${index + 1}/${statements.length}] FAILED: ${label(statement)}`);
                console.error(`      ${err.message}`);
                if (stopOnError) break;
            }
        }
    } finally {
        await conn.end();
    }

    console.log(`\nDone: ${ok} succeeded, ${failures.length} failed.`);
    if (failures.length) {
        console.error("\nFailed statements:");
        for (const f of failures) console.error(`  [${f.index}] ${f.statement}\n      ${f.message}`);
        // A non-zero exit is what lets a caller chain this safely rather than
        // assuming success.
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("Schema load failed:", err.message);
    process.exit(1);
});
