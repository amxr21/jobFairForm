# Where the database schema lives

**The authoritative schema for this database is not in this repo.** It is:

```
apps/dashboard/backend/migrations/schema.sql   (repo: github.com/amxr21/jobFair)
```

That file creates all 19 tables. This repo's `prisma/schema.prisma` declares only
the three this app actually reads and writes — `companies`, `applicants`,
`applicant_company_relations` — because Prisma only needs models for the tables
it queries.

## Why schema.sql is not copied here

The form backend and the dashboard backend share **one** database. If this repo
carried its own copy of `schema.sql`, the two copies would drift, and the loser
would be whichever app was deployed second. One file, one repo, no drift.

## Do NOT use `prisma db push` to create this database

`db push` makes the database match `schema.prisma`, and `schema.prisma` knows
about three tables. Running it against a shared database creates a database the
dashboard cannot work with, and against an existing one it will propose dropping
the other sixteen tables. It is safe only against a throwaway test database
(which is what CI does).

## Loading the schema on a fresh database

`scripts/load-schema.js` runs a .sql file statement by statement using the
`mariadb` driver this app already ships — the deployed container has no `mysql`
client, so a `mysql < schema.sql` pipe is not available.

Because `schema.sql` lives in the other repo, fetch it into the backend
container's shell first:

```bash
# In the backend container terminal (Coolify → backend app → Terminal)
curl -fsSL -o /tmp/schema.sql \
  https://raw.githubusercontent.com/amxr21/jobFair/main/backend/migrations/schema.sql

node scripts/load-schema.js /tmp/schema.sql --stop-on-error
```

Expect 21 statements: `CREATE DATABASE`, `USE`, and 19 `CREATE TABLE`s.

The file starts with `CREATE DATABASE IF NOT EXISTS jobfair` and `USE jobfair`,
so the database name comes from the file, not from `DATABASE_URL`. If the
Coolify database is named something other than `jobfair`, edit those two lines
before loading or the tables land in the wrong schema.

## Re-running it

Only `CREATE DATABASE` is guarded with `IF NOT EXISTS`; the `CREATE TABLE`
statements are not. Re-running against a populated database reports
"table already exists" for every table. That is non-destructive — nothing is
dropped — but it means the script is not a migration tool. Schema changes go in
the dashboard repo's `migrations/` directory as new ALTER files.

## The two existing ALTER migrations

`add-equipment-requested-by.sql` and `add-parking-map-url.sql` in the dashboard
repo apply only to databases created before those columns existed. A fresh load
from `schema.sql` already includes both (`equipment_requests.requested_by`,
`access_passes.map_url`) — verified against the file. Do not run them on a new
database.
