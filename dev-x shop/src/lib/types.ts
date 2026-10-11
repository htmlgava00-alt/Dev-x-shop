// Dev-X Online Store Core Type Definitions

export type Role = 
  | 'guest' 
  | 'customer' 
  | 'branch_manager' 
  | 'content_manager' 
  | 'operations' 
  | 'admin' 
  | 'super_admin';

export type CategoryKey = 
  | 'books' 
  | 'ebooks' 
  | 'tees' 
  | 'bags' 
  | 'notebooks' 
  | 'stickers' 
  | 'bundles';

export type BookSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type BookCategory = 
  | 'Fundamentals' 
  | 'Language Specific' 
  | 'UI/UX & Frontend' 
  | 'Projects & Patterns' 
  | 'Specialized';

export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductVariant {
  id: string;
  size: TShirtSize;
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  cat: CategoryKey;
  sub?: string;
  t: string;
  d: string;
  bg: string;
  price: number;
  sz?: number; // Requires size selector
  sizes?: TShirtSize[];
  skillLevel?: BookSkillLevel;
  bookCategory?: BookCategory;
  isbn?: string;
  stockByBranch?: Record<string, number>;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface Branch {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  workingHoursAr: string;
  workingHoursEn: string;
  googleMapsUrl?: string;
  pickupEligible: boolean;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  size?: TShirtSize;
  q: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  preferredBranch?: string;
  role: Role;
  provider: 'phone' | 'google' | 'facebook' | 'apple' | 'email';
  createdAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethodId = 
  | 'fawry' 
  | 'instapay' 
  | 'vodafone' 
  | 'etisalat' 
  | 'card' 
  | 'bank' 
  | 'cod';

export interface PaymentMethodConfig {
  id: PaymentMethodId;
  ar: string;
  en: string;
  icon: string;
  status: 'fully_integrated' | 'awaiting_credentials' | 'manual_workflow';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'delivery';
  branchId?: string;
  addressDetails?: string;
  items: Array<{
    productId: string;
    title: string;
    size?: TShirtSize;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethodId;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  freeStickersAwarded: number;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  branchId: string;
  productId: string;
  variantSize?: TShirtSize;
  delta: number;
  reason: string;
  type: 'sale' | 'restock' | 'transfer' | 'return' | 'adjustment';
  timestamp: string;
  performedBy: string;
}
