# Table & Tiffin Restaurant Ordering System

A full-stack restaurant ordering prototype built with Next.js App Router, PostgreSQL, Prisma, NextAuth, Tailwind CSS, shadcn-style UI primitives, Zustand, zod, and bcrypt.

The payment experience is a **test/virtual wallet sandbox**. It never collects card or UPI details and never moves real money.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and provide a PostgreSQL `DATABASE_URL` and a long random `NEXTAUTH_SECRET`.
3. Create and apply the database migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed demo accounts, wallets, categories, and menu items:
   ```bash
   npx prisma db seed
   ```
5. Start the application:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`.

## Demo Accounts

All seeded accounts use password `Demo123!`.

| Role | Email |
|---|---|
| Admin | `admin@table.test` |
| Staff | `staff@table.test` |
| Customer | `customer@table.test` |
| Customer | `rohan@table.test` |

The primary customer starts with ₹2,500 in virtual funds.

## Payment Simulation

`PAYMENT_FAILURE_RATE` accepts a decimal from `0` through `1`. For example, `0.05` randomly declines approximately 5% of attempts. It defaults to `0`. `PAYMENT_DELAY_MS` defaults to `1000` to mimic gateway latency.

Checkout, wallet top-ups, and eligible cancellation refunds use serializable Prisma transactions. Checkout conditionally debits the wallet, credits the `PLATFORM` ledger, records the payment, marks the order paid, and clears the cart atomically.

## Routes

- Customer: `/`, `/menu/[itemId]`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/wallet`
- Admin: `/admin`, `/admin/users`, `/admin/staff`, `/admin/orders`, `/admin/menu`
- Staff: `/staff`, `/staff/menu`, `/staff/orders`, `/staff/orders/[id]`

Middleware provides route-level role gates. Every mutation independently loads the current database user and checks role and, where applicable, staff permission server-side.
