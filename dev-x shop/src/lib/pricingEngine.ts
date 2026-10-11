// Dev-X Pricing, Tiered Discounts & Gift Sticker Engine

import { CartItem, Product } from './types';
import { PRODUCTS } from './data';

export interface CalculationResult {
  itemsCount: number;
  subtotal: number;
  discountRate: number; // 0, 10, 15, or 20 percent
  discountAmount: number;
  freeStickersAwarded: number;
  shippingFee: number;
  total: number;
}

/**
 * Calculates discount rate according to Dev-X business rule:
 * >= 2400 EGP: 20%
 * >= 1600 EGP: 15%
 * >= 800 EGP:  10%
 * < 800 EGP:   0%
 */
export function calculateDiscountRate(subtotal: number): number {
  if (subtotal >= 2400) return 20;
  if (subtotal >= 1600) return 15;
  if (subtotal >= 800) return 10;
  return 0;
}

/**
 * Calculates free sticker eligibility:
 * Configurable rule: Every qualifying order >= 400 EGP receives 2 promotional stickers,
 * Orders >= 1000 EGP receive 3 promotional stickers.
 */
export function calculateFreeStickers(subtotal: number): number {
  if (subtotal >= 1000) return 3;
  if (subtotal >= 400) return 2;
  return 0;
}

export function calculateCart(
  cartItems: CartItem[], 
  deliveryType: 'pickup' | 'delivery' = 'pickup',
  productCatalog: Product[] = PRODUCTS
): CalculationResult {
  let subtotal = 0;
  let itemsCount = 0;

  for (const item of cartItems) {
    const product = productCatalog.find(p => p.id === item.id);
    if (product) {
      subtotal += product.price * item.q;
      itemsCount += item.q;
    }
  }

  const discountRate = calculateDiscountRate(subtotal);
  const discountAmount = Math.round((subtotal * discountRate) / 100);
  const freeStickersAwarded = calculateFreeStickers(subtotal);
  
  // Branch pickup is always 0 EGP. Standard delivery is 50 EGP.
  const shippingFee = deliveryType === 'pickup' ? 0 : (subtotal > 0 ? 50 : 0);
  const total = (subtotal - discountAmount) + shippingFee;

  return {
    itemsCount,
    subtotal,
    discountRate,
    discountAmount,
    freeStickersAwarded,
    shippingFee,
    total
  };
}
