# Dev-X Online Store — Technical Architecture & Security Overview

## 1. System Architecture
Dev-X Online Store is designed as a high-performance, modular full-stack application optimized for the Egyptian e-commerce ecosystem.

```
┌────────────────────────────────────────────────────────┐
│               Dev-X Online Storefront                  │
│       Arabic (RTL) & English (LTR) Next.js App         │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       [REST / Server Actions]   [Client-Side Events]
                │                        │
┌───────────────▼────────────────────────▼───────────────┐
│                 Application Services                   │
│  - Catalog & Variant Engine    - Cart & Pricing Engine │
│  - Branch & Inventory Ledger   - Order State Machine   │
│  - RBAC Security Enforcer      - Payment Adapters      │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
┌───────────────▼────────┐      ┌────────▼───────────────┐
│ PostgreSQL / Supabase  │      │ External Gateways      │
│  - Encrypted Profiles  │      │  - Paymob / Fawry Webhooks
│  - Audited Movements   │      │  - Vodafone / InstaPay │
│  - Row-Level Security  │      │  - SMS / WhatsApp API  │
└────────────────────────┘      └────────────────────────┘
```

---

## 2. Security Architecture

### 2.1 Authentication & Authorization
1. **Egyptian Mobile OTP**:
   - Phone numbers are validated against Egyptian telco regex: `^(\+20)?01[0125][0-9]{8}$`.
   - Rate limiting: Max 3 OTP requests per 10 minutes per IP/Phone.
   - Demo fallback is strictly isolated to development environments.
2. **Role-Based Access Control (RBAC)**:
   - Evaluated server-side in API routes and database Row-Level Security (RLS).
   - `Branch Manager` can only access and modify inventory/orders assigned to their specific `branch_id`.
   - `Super Admin` has full platform controls; initial bootstrap is protected via environment secret keys.
3. **Sensitive Data Protection**:
   - Never store raw card numbers, PINs, or CVVs.
   - Secrets (`DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYMOB_API_KEY`) are kept strictly on the server.

### 2.2 Transactional Concurrency & Inventory
- **Preventing Overselling**:
  - Inventory decrements execute in atomic SQL transactions using row-level locking (`SELECT ... FOR UPDATE`).
  - Stock movement is tracked through an immutable append-only ledger (`inventory_movements`), ensuring full auditability.

### 2.3 Payment Integrity
- **Webhook Signature Verification**:
  - Payment webhooks from Paymob, Fawry, and Cash wallets require HMAC-SHA256 signature verification before processing.
  - Webhook processing is idempotent: duplicate callbacks are rejected using unique `transaction_id`.
  - Cash on Delivery (COD) transactions start as `payment_status = 'unpaid'` until physically confirmed by branch operations or courier.

---

## 3. Localization & Responsive UX
- Genuine RTL layout with direction-aware Tailwind classes (`start`, `end`, `margin-inline`).
- Default locale: Egyptian Arabic (`ar-EG`), Secondary: English (`en-US`).
- Currency: Egyptian Pounds (`EGP` / `ج.م`).
