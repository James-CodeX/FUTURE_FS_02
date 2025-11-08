# OneStopStore – Mini E‑Commerce Storefront

A full‑stack Next.js app that implements the Future Interns “Mini E‑Commerce Storefront” task with SSR pages, a shopping cart, checkout, authentication, order history, and an admin dashboard.

[Live](https://future-onestopshop.netlify.app/)

![App Screenshot](./public/screenshot.png)

## ✅ Task Coverage

- Product listing page with search/filter
- Product detail page
- Shopping cart with quantity control, totals, and live badge
- Checkout flow (simulated payment) with form validation and order creation
- Login / Register (JWT cookie) and protected routes
- Order confirmation and user order history
- Admin dashboard to list orders and mark them Fulfilled

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS
- Prisma ORM + PostgreSQL (Neon)
- JWT auth (HttpOnly cookie)

## App Structure

```
app/                  Routes (App Router)
	api/                Auth + Orders APIs
	admin/              Admin dashboard (protected)
	checkout/           Checkout page
	login/              Login/Signup UI
	orders/             Order list + details
	products/[id]/      Product detail page
components/           Product card, cart UI, search bar, etc.
context/              Cart context (state + actions)
lib/                  Prisma client, auth helpers, shared types
prisma/               Prisma schema, migrations, seed script
```

## Local Development

1. Install deps

```cmd
npm install
```

2. Environment
   Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
AUTH_SECRET="replace-with-a-strong-secret"
```

3. Database & Prisma

```cmd
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

4. Start the app

```cmd
npm run dev
```

Visit http://localhost:3000

## Authentication

- JWT is set in an HttpOnly cookie (`auth`). The secret is `AUTH_SECRET`.
- An admin user is seeded:
  - username: `admin`
  - email: `admin@example.com`
  - password: `admin123`

## Key Pages & APIs

- Catalog: `/` with search bar and product cards
- Product Detail: `/products/[id]`
- Cart Drawer: accessible from the header cart icon
- Checkout: `/checkout` – creates an order in the DB
- Login/Signup: `/login` – sets cookie on success
- Orders: `/orders` and `/orders/[id]` – requires login
- Admin: `/admin` – requires admin role; mark orders as Fulfilled
- APIs:
  - `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
  - `GET/POST /api/orders`, `GET/PATCH /api/orders/[id]`

## Deployment

Deploy to Vercel or similar:

1. Push the repo to GitHub.
2. Create a Neon (or Postgres) database; copy the connection string to `DATABASE_URL`.
3. In your hosting dashboard, set `DATABASE_URL` and `AUTH_SECRET` env vars.
4. Run Prisma migrations in your deploy pipeline (or `prisma migrate deploy`).
5. Seed admin (run `npm run prisma:seed` once against production DB).

## Notes

- Images use `next/image` best practices: `fill` + `sizes`, eager/priority for LCP images.
- Admin “Fulfill” action is inline via fetch; the page refreshes without navigating to the API route.
- Orders include a `fulfilled` flag with PATCH support for admin.

---
