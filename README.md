# Q-Balance

Q-Balance is a web app for tracking income and expenses. Organize transactions into reusable items and categories, compare income with spending, and see your balance over a selected date range.

## Live demo

Try Q-Balance at [q-balance.next-nexus.dev](https://q-balance.next-nexus.dev/).

## Features

- **Income and expense tracking:** create, view, edit, and delete transactions with an item, quantity, unit price, and comments. Amounts are calculated from quantity × price.
- **Expense discounts:** optionally apply a discount to the full quantity when creating an expense, with a live preview of the adjusted unit price and total. The adjusted unit price is saved to two decimal places.
- **Categories and items:** manage categories and reusable items, including item descriptions, units, and category assignments.
- **Dashboard:** compare daily income and expenses in an interactive line chart with week, month, and six-month presets. Separate panels show up to seven recent income and expense transactions from the past month.
- **Transaction filters:** browse income or expenses by date range and category, with a total for the selected results.
- **Category reports:** compare income and expenses per category, with overall totals and a calculated balance for the selected period.
- **User accounts:** register, verify an email address, sign in, and sign out. Database queries scope each user's categories, items, and transactions to their account.
- **Password management:** resend verification emails, request password reset emails, and change a password while signed in.
- **Responsive interface:** layouts and navigation adapt to mobile, tablet, and desktop screens.

## Technology stack

| Technology | Use in Q-Balance |
| --- | --- |
| Next.js 16 and React 19 | Application framework and UI |
| TypeScript 6 | Pages, components, actions, and server utilities; some JavaScript utilities and configuration remain |
| App Router | File-based routes, route groups, layouts, dynamic edit pages, and route-level error boundaries |
| React Server Components | Server-rendered pages and direct server-side data loading |
| Server Actions | Authentication and data mutations through forms, followed by path revalidation and redirects where applicable |
| React client components | Interactive forms, filters, navigation, and charts; forms use `useActionState` and pending submission feedback |
| MariaDB via `mysql2/promise` | Persistent storage through a shared connection pool and parameterized SQL queries, without an ORM |
| Better Auth | Email/password authentication, sessions, email verification, and password recovery through an App Router route handler |
| Nodemailer | SMTP delivery of verification and password reset emails |
| Tailwind CSS 4 | Responsive styling, with `clsx` and `tailwind-merge` utilities |
| Recharts | Income and expense line chart with tooltips |
| `next/font` | Geist Sans and Geist Mono font loading |
| Node.js test runner and `tsx` | TypeScript tests for password rules, authentication password validation, and discount calculations |

## Getting started

### Prerequisites

- A Node.js version supported by the installed Next.js release, and npm.
- MariaDB 10.6 or newer with a database initialized from the included schema (see [Database setup](#database-setup)).
- An SMTP account for verification and password reset emails. Email verification is required before sign-in.

### Install and configure

From the repository directory:

```bash
npm ci
cp .env.example .env.local
```

On PowerShell, use `Copy-Item .env.example .env.local` for the second command.

Update `.env.local` with your database and email settings:

| Variable | Description |
| --- | --- |
| `MYSQL_HOST` | Database host; defaults to `127.0.0.1` |
| `MYSQL_PORT` | Database port; defaults to `3306` |
| `MYSQL_USER` | Database username |
| `MYSQL_PASSWORD` | Database password |
| `MYSQL_DATABASE` | Database name; defaults to `q_balance` |
| `BETTER_AUTH_URL` | Application origin, such as `http://localhost:3000` for development |
| `BETTER_AUTH_SECRET` | Random authentication secret of at least 32 characters |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | Typically `587` for STARTTLS or `465` for TLS |
| `SMTP_SECURE` | `false` for STARTTLS on port `587`; `true` for TLS on port `465` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `SMTP_FROM_EMAIL` | Sender allowed by your provider, for example `Q-Balance <noreply@example.com>` |

Keep real credentials in `.env.local`, which is ignored by Git. The committed `.env.example` contains placeholders.

### Database setup

The active data layer is `lib/transactions-mariadb.ts`, backed by the connection pool in `db.ts`. Application data and Better Auth both use that pool.

The complete initialization schema is included in [`database/schema.sql`](database/schema.sql). It targets **MariaDB 10.6 or newer** and creates all seven application and Better Auth tables, including primary keys, foreign keys, unique constraints, and query indexes. It has been validated against MariaDB 10.6.23 and the installed Better Auth version.

From the repository directory, connect with a MariaDB account allowed to create the database and tables:

```bash
mariadb -u root -p
```

Then run these commands in the MariaDB client:

```sql
CREATE DATABASE q_balance
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE q_balance;
SOURCE database/schema.sql;
SHOW TABLES;
```

If you use another database name, replace `q_balance` above and set `MYSQL_DATABASE` accordingly. Configure `MYSQL_USER` and `MYSQL_PASSWORD` for an application account with `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges on that database. Use an administrative account for initialization rather than running the app as root. The MariaDB client does not load `.env.local` automatically.

For an already-created **empty** database, you can import directly from Bash or WSL:

```bash
mariadb -h 127.0.0.1 -P 3306 -u your_database_user -p q_balance < database/schema.sql
```

The importing account needs permission to create tables and their constraints. On PowerShell, use the interactive `SOURCE` instructions above.

**This schema is for fresh installations, not upgrades.** It does not delete tables or data, and intentionally fails on existing table names rather than silently accepting an incompatible schema. MariaDB commits DDL statements implicitly; a failed import can leave some tables created. Do not import it over an existing installation or run the historical migrations afterward.

| Table | Purpose |
| --- | --- |
| `user` | User profiles and email verification status |
| `session` | Authentication sessions |
| `account` | Authentication credentials and provider accounts, including Better Auth's `issuer` field and unique issuer/account index |
| `verification` | Verification and password recovery tokens |
| `categories` | User-owned income and expense categories |
| `items` | Reusable items with units and category assignments |
| `transactions` | Income and expense entries with quantity, unit price, comments, and creation time |

Application IDs are auto-incrementing integers, while authentication IDs are supplied by Better Auth. Transaction types are `1` for income and `2` for expenses. Prices use `DECIMAL(15, 2)` and quantities use `DECIMAL(15, 4)`. Transaction timestamps default to the current database time. Composite foreign keys enforce that items and their categories, and transactions and their items, belong to the same user.

Categories referenced by items and items referenced by transactions cannot be deleted until their dependent records are removed or reassigned. This protects transaction history from accidental deletion.

Local historical database artifacts are excluded by `.gitignore`: `better-auth_migrations/`, the PostgreSQL-specific `migrations/2026-09-28-add-user-ownership.sql`, and `lib/transactions-sqlite.js.no_longer_used`. Fresh installations use only `database/schema.sql`; SQLite is not the current database.

### Run locally

Once the database and environment are configured:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000), create an account, and follow the verification link sent to your email. After signing in, create a category, add an item assigned to it, and start recording transactions.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm test` | Run the existing TypeScript tests |

For production, configure the database and SMTP service, set `BETTER_AUTH_URL` to the public application origin, and provide a strong `BETTER_AUTH_SECRET`, then run:

```bash
npm run build
npm start
```

## Account security

New registrations require email verification before sign-in. Verification emails can be requested again at `/verify-email`, and password reset emails at `/forgot-password`. Verification and reset links expire after one hour.

New passwords must contain 10–128 characters, including an uppercase letter, a lowercase letter, a number, and a special character. Whitespace does not count as a special character. These rules apply to registration, password resets, and password changes. Existing passwords remain valid for sign-in until changed or reset; existing unverified accounts must verify their email before signing in.

Signed-in password changes require the current password and revoke other sessions. Password resets revoke all sessions.

## Project structure

```text
actions/                  Server Actions for authentication and data mutations
app/
  (authentication)/       Sign-in, sign-up, verification, and password recovery
  (content)/              Dashboard, reports, CRUD pages, and password changes
  api/auth/[...all]/       Better Auth route handler
components/               Shared UI, forms, filters, navigation, and charts
lib/                      Authentication, email, database queries, and validation
database/schema.sql       Complete MariaDB schema for fresh installations
tests/                    Password and discount tests
db.ts                     MariaDB connection pool
.env.example              Environment configuration template
```

## What belongs in the repository

Commit the application source, public assets, configuration files, `package.json`, `package-lock.json`, `.env.example`, `database/schema.sql`, and this README. Keep `tests/` as well: tests are not required to serve the app, but they let contributors verify password rules and discount calculations with `npm test`.

Dependencies (`node_modules/`), build output (`.next/`, `out/`, and `build/`), generated TypeScript files, coverage output, local environment files, and the historical database artifacts listed above are excluded by `.gitignore`. Dependencies are restored by `npm ci`, and Next.js generates its build output and `next-env.d.ts` during development or builds.

## Current scope

Q-Balance provides manual income and expense tracking and reporting. Bank synchronization, transaction import/export, recurring transactions, budgets, invoicing, and currency conversion are not currently implemented. The existing tests cover selected authentication and calculation logic; they do not provide end-to-end coverage of the app or database operations.

