# Subedi CUTs

A modern barber shop landing page and booking demo built to showcase front-end development and UI design. The site includes a parallax gallery, client reviews, a multi-step appointment flow, and Supabase-backed availability.

> **Note:** This is a personal project, not a real business. Bookings are stored in Supabase for demonstration only.

## Features

- **Hero** — Brand headline with call-to-action
- **Gallery** — Scroll-driven parallax photo columns (SQUIRE-style)
- **Reviews** — Rating summary and client testimonial cards
- **Booking** — 4-step flow: service → date/time → contact → confirm
- **Footer** — Hours, navigation, social links, project disclaimer
- **Smooth scroll** — Eased in-page navigation with section reveal animations
- **Supabase** — Live slot availability and booking storage with row-level security

## Tech stack

| Layer | Tools |
|-------|--------|
| UI | React 19, Vite 8 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL + REST) |
| Fonts | Bebas Neue (logo), Inter (body) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- A [Supabase](https://supabase.com) project (free tier is fine)

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project credentials (Dashboard → **Settings** → **API**):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Use the **anon / publishable** key only. Do not use the `service_role` key in the frontend.

### 3. Database setup

Open the [Supabase SQL Editor](https://supabase.com/dashboard) and run:

| Situation | File to run |
|-----------|-------------|
| New project | [`supabase/schema.sql`](supabase/schema.sql) |
| Already ran an older schema | [`supabase/migrate-secure-rls.sql`](supabase/migrate-secure-rls.sql) once |

View bookings in **Table Editor → `bookings`**.

### 4. Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Customization

Most content is driven by data files — no need to hunt through components for copy changes.

| File | What to edit |
|------|----------------|
| [`src/data/services.js`](src/data/services.js) | Haircut types, prices, durations |
| [`src/data/businessHours.js`](src/data/businessHours.js) | Open days, hours, booking horizon |
| [`src/data/reviews.js`](src/data/reviews.js) | Testimonials and Google review URL |
| [`src/data/galleryImages.js`](src/data/galleryImages.js) | Gallery photos (add images under `src/assets/gallery/`) |
| [`src/data/site.js`](src/data/site.js) | Footer contact, social links, disclaimer |

## Project structure

```
src/
├── components/     # Hero, Gallery, Reviews, Booking, Footer, Navbar
│   ScrollLink.jsx  # Smooth scroll anchors
│   ScrollReveal.jsx# Scroll-in animations
├── data/           # Static config and content
├── lib/            # Supabase, booking API, scroll utilities
├── assets/         # Logo, gallery, review photos
├── App.jsx
└── index.css       # Design tokens (colors, fonts)

supabase/
├── schema.sql              # Full schema + secure RLS (new projects)
└── migrate-secure-rls.sql  # RLS upgrade for existing databases
```

## Security

Safe to push to GitHub if you follow these rules:

- **Never commit** `.env` — it is listed in [`.gitignore`](.gitignore). Only commit [`.env.example`](.env.example) with placeholders.
- The **anon key** is embedded in the browser bundle after build; that is expected for Supabase client apps.
- **RLS** restricts anonymous reads to `id`, `starts_at`, and `ends_at` so client emails and phone numbers are not exposed via the public API.
- Inserts are validated in the database (email format, booking window, service limits).

## Deployment

Build the static site and deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages, etc.):

```bash
npm run build
```

Set the same `VITE_SUPABASE_*` variables in your host’s environment settings before building.

## Author

Built by **Sworup Subedi** as a portfolio piece.
