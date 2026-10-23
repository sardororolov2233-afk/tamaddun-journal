This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Tamaddun issue archive

Journal intake settings, contact details and APC prices live in
`src/lib/journal.ts`. The archive lists issues by year, volume and issue number;
editors select publication placement before approving articles or theses.

**Existing Supabase deployments:** apply
[`supabase/migrations/20261023_issue_archive.sql`](supabase/migrations/20261023_issue_archive.sql)
before deploying this version. It adds required publication metadata and moves
existing publications into volume 1, issues 1 and 2 (2026). See
[archive setup and migration notes](supabase/ARCHIVE_SETUP.md).

Without Supabase variables, on-site account creation and submission are unavailable; the public archive can still show sample records.
The `/submit` page provides email and Telegram alternatives for real submissions.
The payment page has no simulated payment integration.

Run archive logic checks with `node --test tests/journal-archive.test.cjs`.

## Account payments and receipts

Before deploying the payment workflow, apply
[`20261024_payments.sql`](supabase/migrations/20261024_payments.sql) after the archive
migration. See [payment setup](supabase/PAYMENT_SETUP.md) for Auth settings, private
receipt storage, admin review and deletion. Site submissions now require a real
Supabase-authenticated account; browser-local demo login is disabled.
