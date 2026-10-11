# Dev-X Online Store — Production Deployment & Operations Guide

## 1. Hosting Architecture Recommendation
- **Storefront & Edge Frontend**: Deployable on Vercel or any Node.js 18+ container.
- **Database & Storage**: Managed PostgreSQL on Supabase (Frankfurt / AWS eu-central-1 for lowest latency to Egypt).
- **Domain & CDN**: Custom domain `shop.dev-x.academy` proxied through Cloudflare with Arabic compression and TLS 1.3 enabled.

---

## 2. Step-by-Step Deployment Procedure

### Step 2.1: Database Provisioning
1. Create a new Supabase project or PostgreSQL 15+ database instance.
2. In SQL Editor, run the migration script defined in `docs/requirements-traceability.md`.
3. Verify that the following tables exist:
   - `profiles`, `branches`, `categories`, `products`, `product_variants`
   - `branch_inventory`, `inventory_movements`, `orders`, `order_items`
4. Confirm Row-Level Security (RLS) is enabled.

### Step 2.2: Initial Seed Data
1. Insert the 8 official branches:
   - Al-Baragil, Maadi, Al-Warraq, Rod El-Farag, Dokki, 6th of October, Imbaba, Ard El-Liwa.
2. Insert catalog categories:
   - `books`, `ebooks`, `tees`, `bags`, `notebooks`, `stickers`, `bundles`.
3. Insert product items (28 SKUs) from `src/lib/data.ts`.

### Step 2.3: Super Admin Initialization
1. Register the primary administrative account via email/password.
2. In the `profiles` table, set `role = 'super_admin'` for this user.
3. Access the administrative dashboard.

### Step 2.4: Payment Gateway Credentials
- **Paymob / Cards**: Register webhook callback URLs pointing to `/api/webhooks/paymob` and save the HMAC secret in `.env`.
- **Vodafone Cash & InstaPay**: Configure the business receiving accounts and set up the manual review queue for order approvals.
- **Fawry Pay**: Enter Merchant Code and Secret Key.

### Step 2.5: WhatsApp Integration
1. Set up Meta WhatsApp Cloud API credentials.
2. Pre-approve bilingual message templates:
   - `order_confirmation_ar`
   - `order_status_update_ar`
   - `shipping_tracking_ar`

---

## 3. Production Smoke-Test Checklist

- [ ] Homepage loads in under 1.5s with hero slider and category shelves.
- [ ] Language toggle instantly switches between Arabic (RTL) and English (LTR).
- [ ] Theme switcher toggles between Dark Mode and Light Mode without layout shifts.
- [ ] T-Shirts mandate a size selection (S, M, L, XL, XXL) before adding to cart.
- [ ] Cart correctly calculates tiered discounts (10% >= 800 EGP, 15% >= 1600 EGP, 20% >= 2400 EGP).
- [ ] Free gift sticker rules apply on orders over 400 EGP and 1000 EGP.
- [ ] Checkout allows switching between Branch Pickup (0 EGP) and Home Delivery (50 EGP).
- [ ] Branch selection shows all 8 configured locations.
- [ ] Completed order generates structured WhatsApp notification and updates database.
- [ ] Inventory movement ledger prevents negative stock and logs all transfers.
- [ ] Branch Manager role is strictly restricted to assigned branch inventory and orders.
