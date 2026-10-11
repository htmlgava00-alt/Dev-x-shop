-- ====================================================================
-- Dev-X Online Store — Full Production Database Migration
-- PostgreSQL 15+ / Supabase Schema
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (RBAC & User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    city TEXT,
    address_details TEXT,
    preferred_branch_id TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN (
        'guest', 
        'customer', 
        'branch_manager', 
        'content_manager', 
        'operations', 
        'admin', 
        'super_admin'
    )),
    provider TEXT NOT NULL DEFAULT 'phone' CHECK (provider IN ('phone', 'google', 'facebook', 'apple', 'email')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Branches Table (The 8 Official Dev-X Branches)
CREATE TABLE IF NOT EXISTS public.branches (
    id TEXT PRIMARY KEY, -- e.g. 'al-baragil', 'maadi', 'dokki'
    code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    address_ar TEXT NOT NULL,
    address_en TEXT NOT NULL,
    phone TEXT NOT NULL,
    working_hours_ar TEXT NOT NULL,
    working_hours_en TEXT NOT NULL,
    google_maps_url TEXT,
    pickup_eligible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY, -- 'books', 'ebooks', 'tees', 'bags', 'notebooks', 'stickers', 'bundles'
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    badge_label_ar TEXT,
    sort_order INT DEFAULT 0
);

-- 4. Products Table (28 Dev-X Catalog SKUs)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY, -- Maps directly to media asset IDs e.g. '17111', '17138'
    sku TEXT UNIQUE NOT NULL,
    category_id TEXT REFERENCES public.categories(id),
    subcategory TEXT,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    badge_ar TEXT,
    badge_en TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    requires_size BOOLEAN DEFAULT FALSE,
    available_sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
    skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
    book_category TEXT,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Branch Inventory Table (Per Product, Per Branch, Per Variant)
CREATE TABLE IF NOT EXISTS public.branch_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id TEXT REFERENCES public.branches(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    size_variant TEXT NOT NULL DEFAULT 'default',
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_branch_product_size UNIQUE (branch_id, product_id, size_variant),
    CONSTRAINT non_negative_stock CHECK (stock_quantity >= 0)
);

-- 6. Immutable Inventory Movement Ledger (Audit Trail)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movement_code TEXT UNIQUE NOT NULL,
    branch_id TEXT REFERENCES public.branches(id),
    product_id TEXT REFERENCES public.products(id),
    size_variant TEXT NOT NULL DEFAULT 'default',
    delta INT NOT NULL,
    reason TEXT NOT NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('sale', 'restock', 'transfer', 'return', 'adjustment')),
    performed_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
    branch_id TEXT REFERENCES public.branches(id),
    address_details TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_rate INT NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('fawry', 'instapay', 'vodafone', 'etisalat', 'card', 'bank', 'cod')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
    free_stickers_awarded INT NOT NULL DEFAULT 0,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Line Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id),
    product_title TEXT NOT NULL,
    size_variant TEXT,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10,2) NOT NULL
);

-- 9. Row-Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public products view" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public branches view" ON public.branches FOR SELECT USING (is_active = TRUE);

-- Customer order policies (Customers can only view their own orders)
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (
    auth.uid() = customer_id OR customer_id IS NULL
);

-- Indices for Fast Queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_lookup ON public.branch_inventory(branch_id, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_movements_timestamp ON public.inventory_movements(created_at DESC);
