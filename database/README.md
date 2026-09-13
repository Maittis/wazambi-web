# Postgres / Supabase migration

The app runs on a JSON file store by default (`data/db.json`). Set a
`DATABASE_URL` env var to switch to PostgreSQL (`lib/db.ts` picks the backend
automatically; `lib/dbPostgres.ts` is the Postgres driver, `lib/dbFile.ts` the
file fallback).

## Steps

1. Create a Supabase project (or any Postgres 14+).
2. In Supabase: **SQL Editor → New query**, paste and run
   [`schema.sql`](schema.sql). It creates all tables, indexes and constraints.
3. Seed the owner/staff accounts (run once on a fresh database):

   ```sql
   INSERT INTO staff (full_name, email, password_hash, role) VALUES
   ('Wazambi Owner', 'owner@wazambigps.com', '<scrypt salt:hash>', 'owner'),
   ('Sales Manager', 'sales@wazambigps.com', '<scrypt salt:hash>', 'sales_manager'),
   ('Content Manager', 'content@wazambigps.com', '<scrypt salt:hash>', 'content_manager');

   INSERT INTO system_settings (setting_key, setting_value) VALUES
   ('content', '{}');
   ```

   The password hash format is `salt:hash` produced by
   `lib/passwords.ts` (`scrypt`, 64-byte hex). Generate one with:

   ```bash
   node -e "const p=require('./lib/passwords').hashPassword; require('fs').writeFileSync('/tmp/hash.txt', p('wazambi123')); console.log(require('fs').readFileSync('/tmp/hash.txt','utf8'))"
   ```

4. Copy `.env.example` → `.env.local` and set:

   ```
   DATABASE_URL=postgres://postgres.<project>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
   ```

5. Restart the app. Data now lives in Postgres. Changing the STAFF_DEFAULT_PASSWORD
   env var sets the onboarding password for new staff.

## Schema notes

- Tables are named after the app's collections (see `lib/dbTypes.ts`).
- Every table has an `id BIGINT GENERATED ALWAYS AS IDENTITY`.
- JSON fields (`meta`, `details`, `settings.value`) are `jsonb`.
- `system_settings` is a key/value store (the CRM edits `content` here).
- Roles/states are `TEXT` with `CHECK` constraints to keep the app schema
  simple; the richer normalized design lives in the root `schema.sql`.