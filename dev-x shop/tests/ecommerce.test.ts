// Dev-X E-Commerce Platform Automated Unit & Integration Tests

import { calculateCart, calculateDiscountRate, calculateFreeStickers } from '../src/lib/pricingEngine';
import { InventoryEngine } from '../src/lib/inventoryEngine';
import { OrderEngine, VALID_STATUS_TRANSITIONS } from '../src/lib/orderEngine';
import { UserProfile } from '../src/lib/types';

describe('Dev-X Online Store Test Suite', () => {

  describe('1. Pricing, Tiered Discounts & Gift Stickers', () => {
    test('Subtotals under 800 EGP receive 0% discount', () => {
      expect(calculateDiscountRate(500)).toBe(0);
      expect(calculateDiscountRate(799)).toBe(0);
    });

    test('Subtotals between 800 and 1599 EGP receive 10% discount', () => {
      expect(calculateDiscountRate(800)).toBe(10);
      expect(calculateDiscountRate(1200)).toBe(10);
      expect(calculateDiscountRate(1599)).toBe(10);
    });

    test('Subtotals between 1600 and 2399 EGP receive 15% discount', () => {
      expect(calculateDiscountRate(1600)).toBe(15);
      expect(calculateDiscountRate(2000)).toBe(15);
      expect(calculateDiscountRate(2399)).toBe(15);
    });

    test('Subtotals of 2400 EGP and above receive 20% discount', () => {
      expect(calculateDiscountRate(2400)).toBe(20);
      expect(calculateDiscountRate(5000)).toBe(20);
    });

    test('Stickers gift promotion correctly applies per order total', () => {
      expect(calculateFreeStickers(300)).toBe(0);
      expect(calculateFreeStickers(500)).toBe(2);
      expect(calculateFreeStickers(1200)).toBe(3);
    });

    test('CalculateCart handles branch pickup (0 shipping) vs delivery (50 EGP)', () => {
      const items = [{ id: '17111', q: 2 }]; // 150 * 2 = 300 EGP
      const pickupCalc = calculateCart(items, 'pickup');
      expect(pickupCalc.subtotal).toBe(300);
      expect(pickupCalc.shippingFee).toBe(0);
      expect(pickupCalc.total).toBe(300);

      const deliveryCalc = calculateCart(items, 'delivery');
      expect(deliveryCalc.shippingFee).toBe(50);
      expect(deliveryCalc.total).toBe(350);
    });
  });

  describe('2. Inventory Control & Branch Scopes', () => {
    let inventory: InventoryEngine;
    const adminUser: UserProfile = {
      id: 'USR-ADMIN',
      name: 'Super Admin',
      phone: '01000000000',
      role: 'admin',
      provider: 'phone',
      createdAt: new Date().toISOString()
    };
    const branchManagerDokki: UserProfile = {
      id: 'USR-MGR-DOKKI',
      name: 'Dokki Manager',
      phone: '01011111111',
      role: 'branch_manager',
      preferredBranch: 'dokki',
      provider: 'phone',
      createdAt: new Date().toISOString()
    };

    beforeEach(() => {
      inventory = new InventoryEngine();
    });

    test('Prevents negative stock deductions', () => {
      // Baseline stock is 25
      const res = inventory.adjustStock('dokki', '17111', -50, 'Excess deduction', adminUser);
      expect(res.success).toBe(false);
      expect(res.error).toContain('negative inventory');
    });

    test('Branch Manager cannot modify inventory of another branch', () => {
      const res = inventory.adjustStock('maadi', '17111', 5, 'Restock', branchManagerDokki);
      expect(res.success).toBe(false);
      expect(res.error).toContain('Unauthorized');
    });

    test('Branch Manager can modify inventory of their assigned branch and audits it', () => {
      const res = inventory.adjustStock('dokki', '17111', 10, 'Restock delivery', branchManagerDokki);
      expect(res.success).toBe(true);
      expect(inventory.getAvailableStock('dokki', '17111')).toBe(35); // 25 + 10
      
      const movements = inventory.getMovements('dokki');
      expect(movements.length).toBeGreaterThan(0);
      expect(movements[0].reason).toBe('Restock delivery');
    });

    test('Transfers stock safely between branches', () => {
      const transferRes = inventory.transferStock('dokki', 'maadi', '17111', 5, adminUser);
      expect(transferRes.success).toBe(true);
      expect(inventory.getAvailableStock('dokki', '17111')).toBe(20);
      expect(inventory.getAvailableStock('maadi', '17111')).toBe(30);
    });
  });

  describe('3. Order Lifecycle & State Machine', () => {
    let orderEngine: OrderEngine;
    const adminUser: UserProfile = {
      id: 'USR-ADMIN',
      name: 'Super Admin',
      phone: '01000000000',
      role: 'admin',
      provider: 'phone',
      createdAt: new Date().toISOString()
    };

    beforeEach(() => {
      orderEngine = new OrderEngine();
    });

    test('Valid order state transitions proceed normally', () => {
      const createRes = orderEngine.createOrder({
        customerName: 'محمود سامي',
        customerPhone: '01234567890',
        deliveryType: 'pickup',
        branchId: 'dokki',
        paymentMethod: 'vodafone',
        items: [{ id: '17111', q: 1 }]
      });

      expect(createRes.success).toBe(true);
      const order = createRes.order!;
      expect(order.orderStatus).toBe('pending');

      // pending -> confirmed
      const t1 = orderEngine.updateOrderStatus(order.id, 'confirmed', adminUser);
      expect(t1.success).toBe(true);

      // confirmed -> processing
      const t2 = orderEngine.updateOrderStatus(order.id, 'processing', adminUser);
      expect(t2.success).toBe(true);
    });

    test('Rejects invalid state jumps (e.g. pending -> delivered directly)', () => {
      const createRes = orderEngine.createOrder({
        customerName: 'محمود سامي',
        customerPhone: '01234567890',
        deliveryType: 'pickup',
        branchId: 'dokki',
        paymentMethod: 'vodafone',
        items: [{ id: '17111', q: 1 }]
      });

      const order = createRes.order!;
      const invalidJump = orderEngine.updateOrderStatus(order.id, 'delivered', adminUser);
      expect(invalidJump.success).toBe(false);
      expect(invalidJump.error).toContain('Invalid transition');
    });

    test('Requires size selection for T-shirts', () => {
      const res = orderEngine.createOrder({
        customerName: 'علي حسن',
        customerPhone: '01122334455',
        deliveryType: 'pickup',
        branchId: 'dokki',
        paymentMethod: 'cod',
        items: [{ id: '17138', q: 1 }] // T-shirt without size
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('requires a size selection');
    });
  });

});
