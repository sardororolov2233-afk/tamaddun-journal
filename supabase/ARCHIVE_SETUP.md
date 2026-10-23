# Issue archive

Current intake is configured in `src/lib/journal.ts`: 2026, volume 1, issue 3.

Before deploying against an existing Supabase project, back up its database and run
`migrations/20261023_issue_archive.sql` once via the Supabase SQL Editor. It adds
publication metadata, divides existing published articles and theses into two
stable halves (issues 1 and 2 of volume 1, 2026), preserves originals and file IDs,
and changes pending submissions to issue 3. Repeating the migration does not move
already assigned or future publications. Original timestamps are preserved.
The runtime cannot run this migration through the anonymous frontend key.

For a new database, apply `supabase_schema.sql` and then this migration.
Existing volume/collection labels should be checked: titles matching `1-Jild,
2-Son` are inferred, otherwise the default is current intake (issue 3).

Authors' submissions default to the configured current intake. The editor chooses
year, volume and issue before publishing each article or thesis. The same fields
are required when uploading a complete issue PDF/cover. Archives group by the
explicit `(publication_year, volume, issue)` tuple; they never redistribute
future articles according to list position. To open the next intake, update the
shared JOURNAL values and database defaults; editors can already publish to any
positive issue number. Empty pending issues are not shown as published.

Without Supabase configuration, sample articles appear only in demo mode, divided
across issues 1 and 2. Existing local published records undergo a one-time
migration using `tamaddun_archive_2026_v1`; future local records keep their issue.
On-site submissions require a real Supabase-authenticated account. Use the email/Telegram
links until Supabase auth, database and storage are connected. Browser-local demo login is disabled.

Payment integration is not configured. APC pages show real prices and contact
instructions; no simulated successful payment or receipt is presented.

Validation: run `node --test tests/journal-archive.test.cjs` from the repository
root. It checks issue separation, future publication grouping, sort order, PDF
collection attachment, thesis URLs, and one-time local migration behavior.
The SQL migration was also tested against an isolated PostgreSQL-compatible
PGlite database, including a second run after adding a future issue record.

## Published-article security trigger

Run the complete migration in a single SQL Editor execution as the database
owner. The migration locks the affected tables against concurrent access, finds
UPDATE triggers backed by `check_article_security` or `check_thesis_security`,
pauses only those guards for the metadata reassignment, and restores their exact
original enabled modes before commit. Other triggers and foreign keys remain
active. Do not disable triggers separately, use `session_replication_role`, or
change the security functions. A failure rolls the entire migration back,
including the paused guards and new columns. After a failed SQL Editor transaction,
run `ROLLBACK;` first, then execute the full updated migration.

If another security function rejects the operation, retain the protection and
inspect that function before extending the explicit guard list.

Optional SQL regression checks (keeps dependencies outside the checkout):

```sh
npm install --prefix /tmp/tamaddun-sql-check --cache /workspace/.npm --no-audit --no-fund @electric-sql/pglite
PGLITE_MODULE=/tmp/tamaddun-sql-check/node_modules/@electric-sql/pglite node --test tests/journal-migration.test.cjs
```

These reproduce the published-article guard error, verify ordinary/ALWAYS/REPLICA
and disabled trigger modes are retained, confirm unrelated triggers still fire,
and check rollback restores both guards and schema after an unrelated rejection.
