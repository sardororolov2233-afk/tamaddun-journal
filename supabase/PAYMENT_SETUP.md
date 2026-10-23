# Authenticated submissions and manual payment review

Run `migrations/20261023_issue_archive.sql` first if it has not been applied.
Then run the complete `migrations/20261024_payments.sql` in the project's Supabase
SQL Editor as the database owner. It is transactional and repeatable. It does
not republish or change pre-existing published work. Do not disable existing
security triggers to apply it. Keep a database backup before deployment.

The deployed app needs NEXT_PUBLIC_SUPABASE_URL and the project's public anon /
publishable key in NEXT_PUBLIC_SUPABASE_ANON_KEY. Never use a service-role key in
the browser. Local-only demo login and role selection have been removed. Enable
email/password signup in Supabase Auth and configure the deployed site URL and
email confirmation redirect URLs. New registrations always get an author
profile. Existing staff roles are preserved; users cannot assign themselves a
staff role. The migration creates missing author profiles for existing users.

Workflow:

1. An authenticated author uploads a manuscript, in pending state, to the
   existing article storage/database workflow.
2. The admin chooses the publication year/volume/issue and clicks “Ma’qullash va
   to‘lov so‘rash”. `journal_request_payment` creates one persistent payment
   request for the manuscript. The price is set by SQL (120000 UZS article,
   80000 UZS thesis), not by client input. The manuscript remains pending.
3. The author's dashboard displays the request. `/payments` opens the transfer
   instructions for card 9860020144204623 and accepts PDF/JPEG/PNG/WEBP receipts
   up to 10 MiB. Receipts go to the private payment-receipts bucket.
4. The admin sees submitted receipts in the same payments page. Confirming after
   checking the actual bank transfer publishes the manuscript in the selected
   issue. A rejected receipt requires a reason and can be uploaded again.
   Cancelling requires a reason and rejects the manuscript. Confirmed payments
   cannot be cancelled through the review action; refunds require a separate
   manual process and are never claimed by the UI.
5. Admin deletion uses journal_delete_submission, removes the article/thesis,
   cancels outstanding payment requests and retains private financial history.
   “Barcha materiallar · o‘chirish” includes pending, approved, rejected and
   published manuscripts. File objects are not deleted automatically, avoiding
   accidental destruction of publication/financial evidence.

Requests/events are read-only to browser roles. Mutations use authenticated RPCs
with role and ownership checks, row locks and atomic payment/publication changes.
Direct unauthenticated/forged submissions, unpaid publication, self-promotion to
admin and receipt replacement are blocked by database rules. Storage boundaries
remain restrictive even if an older project has permissive upload policies.
Receipt links are signed for 120 seconds and visible only to the owner/admin.
The dashboard refreshes on focus and every 30 seconds; no external email or
Telegram delivery is implied by an in-account notification.

Existing custom security triggers are preserved. If a custom trigger rejects
publication/deletion, the operation rolls back and reports the database error;
inspect the function rather than disabling the guard or claiming success.

This is manual transfer verification. Uploading a receipt does not establish
that funds arrived, and the app does not query a bank or Click/Payme gateway.

Tests (optional PGlite engine installed outside the repository):

```sh
npm install --prefix /tmp/tamaddun-sql-check --cache /workspace/.npm --no-audit --no-fund @electric-sql/pglite
PGLITE_MODULE=/tmp/tamaddun-sql-check/node_modules/@electric-sql/pglite node --test tests/payment-workflow.test.cjs
```

Browser workflow checks were run with intercepted Supabase fixture responses;
SQL authorization/transition checks were run against PGlite with actual RLS and
separate anon/authenticated roles. Neither test sends funds or uploads real
receipts to a live project. Validate the project's Auth, storage upload/signing
and custom triggers after applying the migration to the real project.

For the browser fixture check, install Playwright outside the checkout if it is
not already available. Build with the explicit fake Supabase URL/key below and
start a test server. The script intercepts this URL and uses fixture sessions;
it does not require or use real credentials:

```sh
NEXT_PUBLIC_SUPABASE_URL=https://journal-test.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=public-browser-fixture npm run build
npm run start -- --port 3007
# In another terminal (Chromium at /usr/bin/chromium):
PAYMENT_TEST_BASE_URL=http://127.0.0.1:3007 node tests/payment.browser.cjs
```

PLAYWRIGHT_MODULE can point to an external Playwright installation. Rebuild with
the real deployment settings after this check; do not deploy a fixture build.
