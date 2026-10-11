# Dev-X Online Store — Requirements Traceability Matrix & Architecture Specification

## 1. Overview
This document maps each requirement from the Dev-X Online Store Specification to its architectural implementation, data model, backend service, frontend view, and verification strategy.

---

## 2. Traceability Matrix

| Requirement ID | Domain | Feature Description | Implemented In (Layer / File) | Database Entity / Model | Verification & Tests |
|---|---|---|---|---|---|
| **REQ-AUTH-01** | Authentication | Egyptian Phone OTP login with normalization (`+201XXXXXXXXX`) | `lib/auth/`, `api/auth/otp` | `users`, `auth_sessions` | OTP format validation, demo fallback, rate-limiting |
| **REQ-AUTH-02** | Authentication | Social Logins (Google, Facebook, Apple) & Email fallback | `lib/auth/providers/` | `users`, `oauth_accounts` | Token verification, payload mapping |
| **REQ-AUTH-03** | Authorization | Role-Based Access Control (Guest, Customer, Branch Manager, Admin, Super Admin) | `lib/auth/rbac.ts` | `roles`, `user_roles`, `permissions` | Unauthorized route blocks, least-privilege checks |
| **REQ-CAT-01** | Catalog | 4 Primary Categories (T-shirts, Books, Notebooks, Stickers) + Bags/E-books | `features/catalog/` | `categories`, `products` | Category filters, subcategory filtering |
| **REQ-CAT-02** | Catalog | T-Shirt variant requirements (Sizes: S, M, L, XL, XXL) with audience tags | `features/catalog/variants` | `product_variants`, `variant_stock` | Size selector required before cart addition |
| **REQ-CAT-03** | Catalog | Programming books classification (Fundamentals, Language, UI/UX, Patterns, Specialized) | `features/catalog/books` | `book_metadata` | Skill level display, metadata verification |
| **REQ-CAT-04** | Catalog | Dual-model stickers (Paid collections vs. Free gift tiers per qualifying order) | `features/promotions/gifts` | `promotions`, `gift_rules` | Server-side gift injection on subtotal threshold |
| **REQ-BRN-01** | Branches | 8 Official Branches (Al-Baragil, Maadi, Al-Warraq, Rod El-Farag, Dokki, 6th of October, Imbaba, Ard El-Liwa) | `features/branches/` | `branches` | Branch locator, working hours, pickup eligibility |
| **REQ-BRN-02** | Inventory | Branch-isolated inventory & Branch Manager permission scope | `features/inventory/` | `branch_inventory`, `stock_transfers` | Cross-branch modification blocked on server |
| **REQ-CART-01** | Cart | Tiered quantity discount (10% >= 800 EGP, 15% >= 1600 EGP, 20% >= 2400 EGP) | `lib/cart/pricing.ts` | `orders.discount_amount` | Server-revalidated cart subtotals and discounts |
| **REQ-ORD-01** | Checkout | Egyptian checkout flow: Branch pickup vs. Governorate delivery | `features/checkout/` | `orders`, `order_items` | Address validation, delivery calculation |
| **REQ-ORD-02** | Orders | Order lifecycle state machine (Pending -> Confirmed -> Processing -> Shipped -> Delivered / Cancelled) | `services/orders/stateMachine` | `order_history`, `order_status_logs` | Server-side valid state transitions |
| **REQ-PAY-01** | Payments | Egyptian payment gateway adapters (Fawry, InstaPay, Vodafone Cash, Etisalat Cash, Card, COD) | `services/payments/adapters/` | `payments`, `payment_transactions` | Webhook signature check, idempotency, CoD unconfirmed flag |
| **REQ-ADM-01** | Admin | Dedicated Admin Dashboard for orders, products, inventory transfers, and analytics | `admin/` | All operational tables | Role-guarded dashboard, stock adjustment audit log |
| **REQ-I18N-01** | Localization | Bilingual Arabic (RTL default) and English (LTR) experience | `lib/localization/` | Language catalogs (`ar`, `en`) | Dir mirroring, typography, currency (EGP) formatting |

---

## 3. Database Schema Blueprint (PostgreSQL / Supabase)

### 3.1 Core Tables
```sql
-- Profiles & Roles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  city TEXT,
  address_details TEXT,
  preferred_branch_id UUID REFERENCES branches(id),
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'branch_manager', 'content_manager', 'operations', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  address_ar TEXT NOT NULL,
  address_en TEXT NOT NULL,
  google_maps_url TEXT,
  phone TEXT,
  working_hours_ar TEXT,
  working_hours_en TEXT,
  manager_id UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  pickup_eligible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories & Products
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  badge_ar TEXT,
  badge_en TEXT,
  base_price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  requires_size BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variants (e.g., T-Shirt sizes S, M, L, XL, XXL)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  sku_suffix TEXT,
  price_override NUMERIC(10,2),
  is_active BOOLEAN DEFAULT TRUE
);

-- Inventory by Branch
CREATE TABLE branch_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  stock_quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT NOT NULL DEFAULT 0,
  reorder_threshold INT DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(branch_id, product_id, variant_id)
);

-- Inventory Movement Ledger
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  delta INT NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'restock', 'transfer_in', 'transfer_out', 'adjustment', 'return')),
  reference_id TEXT,
  reason TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  branch_id UUID REFERENCES branches(id),
  governorate TEXT,
  shipping_address TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  discount_rate INT DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_title_snapshot TEXT NOT NULL,
  variant_snapshot TEXT,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);
```
