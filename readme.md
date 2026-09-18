# Table & Tiffin - Restaurant Ordering System

A full-stack restaurant ordering prototype built with **Next.js App Router**, **PostgreSQL**, **Prisma**, **NextAuth**, **Tailwind CSS**, shadcn-style UI primitives, Zustand, zod, and bcrypt.

The payment experience is a **test/virtual wallet sandbox**. It never collects card or UPI details and never moves real money.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or a cloud database like Supabase/Neon)
- npm or yarn

## 🚀 Complete Setup Guide

Follow these steps to get the project up and running locally.

### 1. Clone & Install

First, clone the repository (if you haven't already) and install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Open `.env` and set up your variables:
- `DATABASE_URL`: Your PostgreSQL connection string. 
  Example: `postgresql://postgres:password@localhost:5432/restaurant_db`
- `NEXTAUTH_SECRET`: A secure random string for NextAuth. You can generate one using `openssl rand -base64 32`.
- `NEXTAUTH_URL`: Should be `http://localhost:3000` for local development.

### 3. Database Setup (Prisma)

This project relies on **Prisma** as the ORM. Here are the step-by-step Prisma commands to initialize your database:

**Step A: Push or Migrate the Schema**
To create the tables in your database based on `prisma/schema.prisma`:

```bash
# Option 1: Create a migration history (Recommended for local dev)
npx prisma migrate dev --name init

# Option 2: Push the schema directly without migration history (Quick sync)
npx prisma db push
```

**Step B: Generate Prisma Client**
Generate the TypeScript client based on your schema so you get full autocompletion in the code:

```bash
npx prisma generate
```

**Step C: Seed the Database**
Populate the database with demo accounts, wallets, categories, and menu items so you have data to test with:

```bash
npx prisma db seed
```

*Note: You can view the raw seeding logic in `prisma/seed.ts`.*

**Step D: Open Prisma Studio (Optional)**
Prisma provides a built-in GUI to view and edit your database records easily:

```bash
npx prisma studio
```
*(This will open a web interface, usually at `http://localhost:5555`)*

### 4. Start the Application

Once the database is set up and seeded, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Prisma Command Cheat Sheet

Here are some common Prisma commands you might need during development:

- `npx prisma format`: Formats your `schema.prisma` file.
- `npx prisma validate`: Validates your `schema.prisma` file.
- `npx prisma migrate reset`: Drops the database, recreates it, runs migrations, and runs the seed script (great for a clean slate).
- `npx prisma migrate deploy`: Applies pending migrations to the database (used in production).
- `npx prisma db pull`: Pulls the schema from an existing database and updates your `schema.prisma`.

---

## 🔑 Demo Accounts

All seeded accounts use the password: `Demo123!`

| Role | Email | Notes |
|---|---|---|
| **Admin** | `admin@table.test` | Full access to all admin routes. |
| **Staff** | `staff@table.test` | Access to staff dashboard & order management. |
| **Customer** | `customer@table.test` | Starts with ₹2,500 in virtual funds. |
| **Customer** | `rohan@table.test` | Additional demo customer account. |

---

## 💸 Payment Simulation

The app uses a virtual wallet system. You can configure its behavior in `.env`:

- `PAYMENT_FAILURE_RATE`: Accepts a decimal from `0` through `1`. For example, `0.05` randomly declines approximately 5% of attempts. It defaults to `0`. 
- `PAYMENT_DELAY_MS`: Defaults to `1000` to mimic gateway latency.

Checkout, wallet top-ups, and eligible cancellation refunds use **serializable Prisma transactions**. Checkout conditionally debits the wallet, credits the `PLATFORM` ledger, records the payment, marks the order paid, and clears the cart atomically.

---

## 🗺️ Routes & Architecture

### Key Routes
- **Customer**: `/`, `/menu/[itemId]`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/wallet`
- **Admin**: `/admin`, `/admin/users`, `/admin/staff`, `/admin/orders`, `/admin/menu`
- **Staff**: `/staff`, `/staff/menu`, `/staff/orders`, `/staff/orders/[id]`

### Middleware & Security
Middleware provides route-level role gates. Every mutation independently loads the current database user and checks role and, where applicable, staff permission server-side, ensuring a secure authorization flow.
