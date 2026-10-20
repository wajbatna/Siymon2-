# 🍽️ SIYMON — Food Delivery Web App

A complete, premium **food-delivery web application**: a customer-facing storefront
(onboarding, home, categories, product details, cart, checkout, orders, auth) plus a
full **admin dashboard** (KPIs, charts, orders, products, categories, restaurants,
customers, delivery personnel, promotions, reports, settings).

Built as a **fully interactive front-end demonstration** with realistic local demo
data, designed to deploy on **GitHub Pages** (static hosting, no server required).

> ⚠️ **Demo disclaimer** — orders, payments, accounts and analytics are simulated in
> the browser (localStorage). Nothing is sent to a server. Production features
> (real payments, secure auth, multi-user sync, live driver GPS…) require a backend;
> see [Demo vs Production](#demo-vs-production) below.

---

## ✨ Highlights

- **Design system** inspired by the reference art direction: dark purple `#292345` /
  navy `#211D3B` surfaces, warm yellow `#FFD889` & cream `#FFF9ED` sections, purple
  gradient buttons, large radii, soft shadows, photorealistic food photography.
- **Customer app**: onboarding slides → home hero → categories → search with live
  suggestions → product pages (sizes, extras, instructions) → cart drawer & cart page
  → validated checkout with coupons → order confirmation & status timeline →
  reorder / cancel → login & registration (demo auth).
- **Admin dashboard** at `/#/admin`: 6 KPI cards, revenue & orders charts, status
  distribution, top products, recent orders, date-range filters, full CRUD for
  products / categories / restaurants / coupons, order management with status
  updates and CSV export, customer & driver management, settings with demo-data reset.
- **Moroccan cuisine first-class**: tagine, couscous, harira, mint tea and charcoal
  grill sections with authentic photography.
- **Responsive** from ~320 px phones (bottom tab bar, drawers) to large desktops.
- **Accessible**: semantic landmarks, aria labels, keyboard-focusable controls,
  visible focus rings, form errors announced with `role="alert"`.

## 🧱 Tech stack

| Layer        | Choice                                             |
| ------------ | -------------------------------------------------- |
| Framework    | React 18 + TypeScript (strict)                     |
| Build        | Vite 5                                             |
| Styling      | Tailwind CSS 3 + CSS design tokens (`src/styles`)  |
| Routing      | React Router 6 (**HashRouter** — Pages-friendly)   |
| State        | Zustand (cart & auth persisted, data store)        |
| Icons        | Lucide React                                       |
| Charts       | Recharts                                           |
| Data         | Versioned localStorage "db" + async service layer  |

## 🚀 Quick start

```bash
npm install       # install dependencies
npm run dev       # local dev server (http://localhost:5173)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

### Demo credentials

| Role     | Email            | Password   |
| -------- | ---------------- | ---------- |
| Customer | demo@siymon.ma   | demo1234   |
| Admin    | admin@siymon.ma  | admin1234  |

One-click demo buttons are available on the login screens. Demo coupon codes:
`SIYMON10`, `WELCOME20`, `DELIVERY15`.

## 📁 Project structure

```
├── .github/workflows/deploy.yml   # GitHub Pages build & deploy
├── public/
│   ├── images/                    # bundled food photography (optimized)
│   └── icons/favicon.svg          # SIYMON brand mark
├── src/
│   ├── components/
│   │   ├── ui/                    # Button, Field, Modal, Drawer, DataTable,
│   │   │                          # Pagination, Badge, Toast, EmptyState…
│   │   ├── store/                 # StoreHeader, Footer, MobileTabBar,
│   │   │                          # ProductCard, CategoryCard, CartDrawer…
│   │   ├── admin/                 # KpiCard, RangePicker, ImagePicker
│   │   └── brand/Logo.tsx         # original SIYMON mark
│   ├── layouts/                   # StoreLayout, AdminLayout, AuthLayout
│   ├── pages/
│   │   ├── store/                 # Home, Search, Category, ProductDetail,
│   │   │                          # Cart, Checkout, Orders, Login, Register…
│   │   └── admin/                 # Dashboard, Orders, Products, Categories,
│   │                              # Restaurants, Customers, Delivery,
│   │                              # Promotions, Reports, Settings
│   ├── services/                  # async API-shaped layer over local db
│   │   (productService, orderService, authService, analyticsService…)
│   ├── store/                     # zustand stores (cart, auth, data, toast, ui)
│   ├── data/                      # seed.ts (catalog, orders…), images.ts
│   ├── hooks/                     # useDebounce, usePagination
│   ├── utils/                     # format, csv, validation, storage, assets…
│   ├── types/                     # shared domain models
│   ├── styles/globals.css         # design tokens + Tailwind layers
│   ├── router.tsx                 # route table (HashRouter)
│   └── main.tsx
└── scripts/smoke.ts               # runtime smoke tests for the service layer
```

## 🌍 GitHub Pages deployment

The site is fully static. Hash-based routing (`/#/home`, `/#/admin/orders`) means
direct navigation and refresh work on Pages without any server rewrite rules.

1. Push this repository to GitHub (any repository name — nothing is hardcoded).
2. In the repository: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. Push to `main` (or run the workflow manually from **Actions → Deploy to GitHub
   Pages → Run workflow**).
4. The site is published at `https://<user>.github.io/<repository-name>/`.

The workflow sets `SIYMON_BASE=/<repository-name>/` so Vite rewrites every asset URL
(JS, CSS, favicon) to the project-site base path. Images referenced at runtime are
resolved through `assetUrl()` (`src/utils/assets.ts`), which respects the same base.

### Local / custom-domain builds

- Default base is `/` — correct for local dev, `vite preview`, or a custom domain
  served from the root.
- For a manual project-site build: `SIYMON_BASE=/<repo-name>/ npm run build`.

## 🧪 Tested checklist

Verified in this repository (build + runtime smoke tests + manual route review):

- [x] `npm install`, `npm run dev`, `npm run build`, `npm run preview` all succeed
- [x] `tsc --noEmit` clean under `strict` + `noUnusedLocals`
- [x] Production build with `SIYMON_BASE=/Siymon2-/` emits `/Siymon2-/assets/…` URLs
- [x] Hash routes survive refresh: `/#/home`, `/#/category/moroccan`, `/#/admin/orders`
- [x] Onboarding: slides, pagination dots, Skip / Continue / Get Started persist flag
- [x] Home: hero, categories, coupons strip, popular, Moroccan section, best sellers,
      new arrivals, restaurants, CTA
- [x] Search: keyword, category chips, sort, pagination, empty state, suggestions
- [x] Category pages: per-category filter, in-category search, sort, pagination
- [x] Product detail: sizes, extras, qty, instructions, related products, add-to-cart
- [x] Cart: qty stepper, remove, clear, coupon apply/remove, totals, free-delivery hint
- [x] Cart persists across reloads (localStorage)
- [x] Checkout: required-field validation, payment selection, simulated payment notice,
      order creation, unique order number, confirmation screen
- [x] Orders: history (account or guest session), details, timeline, cancel (eligible
      statuses only), reorder
- [x] Auth UI: login/register validation, password visibility toggle, logout, demo mode
- [x] Admin guard: `/#/admin` redirects to `/#/admin/login` without an admin session
- [x] Dashboard: KPIs with deltas, revenue area chart, orders bar chart, status donut,
      top products, recent orders, range filters (7/30/90/all)
- [x] Orders admin: search, status/payment/date filters, sorting, pagination, details
      modal, status updates, cancel, CSV export
- [x] Products admin: create/edit/delete (confirm), image picker, tags, featured,
      availability toggle, sizes & extras editors, search/filter, CSV export
- [x] Categories admin: CRUD, icon/color/image, visibility, reorder up/down
- [x] Restaurants admin: CRUD, active/featured, catalog counts
- [x] Customers admin: search/filter, details with order history, block/unblock
- [x] Delivery admin: availability toggles, assigned orders, performance stats
- [x] Promotions admin: CRUD coupons (percent/fixed, min order, expiry, active)
- [x] Reports: revenue by category, orders by weekday, top products, CSV exports
- [x] Settings: brand, currency, delivery fee/threshold, contacts, theme; demo reset
- [x] Service-layer smoke tests (`scripts/smoke.ts`): 23 assertions pass
      (coupon rules, price math, order lifecycle, refunds, analytics)
- [x] Toasts, loading/empty/error states, confirmation dialogs on destructive actions
- [x] Responsive layouts checked at 320 px, 768 px, 1280 px breakpoints

Run the smoke tests locally:

```bash
npx esbuild scripts/smoke.ts --bundle --platform=node --format=cjs --outfile=/tmp/smoke.js && node /tmp/smoke.js
```

## 🆚 Demo vs Production

| Feature | In this demo (static) | Needs a backend |
| --- | --- | --- |
| Catalog, categories, restaurants | ✅ localStorage seed + CRUD | Persistent DB, admin roles |
| Cart & coupons | ✅ persisted per browser | Server-side coupon budgets |
| Orders & status timeline | ✅ simulated lifecycle | Real-time updates (WS/Firebase), kitchen flow |
| Payments | ⛔ clearly labelled simulation | PSP integration (Stripe/CMI…), PCI scope |
| Authentication | ⛔ demo-only, plain-text local users | Real auth (Firebase Auth/Auth0/…), hashing, sessions |
| Customer data | ✅ minimal demo fields | PII protection, consent, deletion (GDPR/ Law 09-08) |
| Drivers & GPS | ✅ static demo roster | Live dispatch, GPS telemetry |
| Notifications | ✅ in-app toasts only | Push/email/SMS providers |
| Analytics | ✅ computed from local demo orders | Warehouse + real events |
| Search | ✅ client-side filter | Server index, typo tolerance |

The service layer (`src/services/*`) is deliberately shaped like an async API client:
swapping `services/db.ts` for `fetch()`/Firebase implementations connects a real
backend without touching the UI. If Firebase is chosen later, use Firebase
Authentication, Firestore security rules and environment-specific config — never
commit service-account keys.

## 📝 License & credits

Front-end demonstration project. Food photography bundled in `public/images` was
sourced via public image search and optimized for the demo; hero visuals are
AI-generated for this project. The SIYMON brand mark is an original design.
