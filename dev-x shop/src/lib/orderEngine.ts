// Dev-X Order Management and State Machine Engine

import { Order, OrderStatus, PaymentMethodId, PaymentStatus, TShirtSize, UserProfile } from './types';
import { BRANCHES, PRODUCTS } from './data';
import { calculateCart } from './pricingEngine';

export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'returned'],
  out_for_delivery: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: []
};

export class OrderEngine {
  private orders: Order[] = [];

  constructor() {
    this.seedExampleOrders();
  }

  private seedExampleOrders() {
    const exampleOrder: Order = {
      id: 'ORD-1728639201',
      orderNumber: 'DX-2026-1001',
      customerName: 'أحمد محمود',
      customerPhone: '01012345678',
      deliveryType: 'pickup',
      branchId: 'dokki',
      items: [
        {
          productId: '17138',
          title: 'Dev-X Students T-Shirt',
          size: 'L',
          unitPrice: 320,
          quantity: 2,
          totalPrice: 640
        },
        {
          productId: '17111',
          title: 'Programming Fundamentals',
          unitPrice: 150,
          quantity: 1,
          totalPrice: 150
        }
      ],
      subtotal: 790,
      discountRate: 0,
      discountAmount: 0,
      shippingFee: 0,
      total: 790,
      paymentMethod: 'vodafone',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      freeStickersAwarded: 2,
      createdAt: new Date().toISOString()
    };
    this.orders.push(exampleOrder);
  }

  public createOrder(params: {
    customerName: string;
    customerPhone: string;
    deliveryType: 'pickup' | 'delivery';
    branchId?: string;
    addressDetails?: string;
    paymentMethod: PaymentMethodId;
    items: Array<{ id: string; size?: TShirtSize; q: number }>;
    user?: UserProfile;
  }): { success: boolean; order?: Order; error?: string } {
    if (!params.customerName || !params.customerPhone) {
      return { success: false, error: 'Customer name and phone number are required.' };
    }

    if (params.deliveryType === 'pickup' && !params.branchId) {
      return { success: false, error: 'Pickup branch must be specified.' };
    }

    if (params.items.length === 0) {
      return { success: false, error: 'Cart is empty.' };
    }

    // Verify variants (e.g. T-Shirts must have a selected size)
    for (const item of params.items) {
      const prod = PRODUCTS.find(p => p.id === item.id);
      if (prod && prod.sz && !item.size) {
        return { success: false, error: `Product "${prod.t}" requires a size selection.` };
      }
    }

    const calc = calculateCart(params.items, params.deliveryType);
    const orderNum = 'DX-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const detailedItems = params.items.map(i => {
      const p = PRODUCTS.find(prod => prod.id === i.id)!;
      return {
        productId: i.id,
        title: p.t,
        size: i.size,
        unitPrice: p.price,
        quantity: i.q,
        totalPrice: p.price * i.q
      };
    });

    const newOrder: Order = {
      id: 'ORD-' + Date.now(),
      orderNumber: orderNum,
      customerId: params.user?.id,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      deliveryType: params.deliveryType,
      branchId: params.branchId,
      addressDetails: params.addressDetails,
      items: detailedItems,
      subtotal: calc.subtotal,
      discountRate: calc.discountRate,
      discountAmount: calc.discountAmount,
      shippingFee: calc.shippingFee,
      total: calc.total,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cod' ? 'unpaid' : 'pending',
      orderStatus: 'pending',
      freeStickersAwarded: calc.freeStickersAwarded,
      createdAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    return { success: true, order: newOrder };
  }

  public updateOrderStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    actor: UserProfile
  ): { success: boolean; error?: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    // Check RBAC
    if (actor.role === 'branch_manager' && order.branchId !== actor.preferredBranch) {
      return { success: false, error: 'Branch managers can only manage orders belonging to their assigned branch.' };
    }

    const allowed = VALID_STATUS_TRANSITIONS[order.orderStatus];
    if (!allowed.includes(newStatus)) {
      return { 
        success: false, 
        error: `Invalid transition from "${order.orderStatus}" to "${newStatus}".` 
      };
    }

    order.orderStatus = newStatus;
    return { success: true };
  }

  public getOrders(filterBranchId?: string): Order[] {
    if (filterBranchId) {
      return this.orders.filter(o => o.branchId === filterBranchId);
    }
    return this.orders;
  }

  /**
   * Generates formatted WhatsApp order confirmation message link
   */
  public generateWhatsAppUrl(order: Order): string {
    const branch = BRANCHES.find(b => b.id === order.branchId);
    const branchLabel = branch ? branch.nameAr : '';

    let text = `مرحباً Dev-X Shop 👋\n`;
    text += `أود تأكيد طلبي برقم: *${order.orderNumber}*\n\n`;
    text += `*تفاصيل المنتجات:*\n`;
    
    order.items.forEach((item, index) => {
      text += `${index + 1}. ${item.title}${item.size ? ` (مقاس: ${item.size})` : ''} × ${item.quantity} = ${item.totalPrice} ج.م\n`;
    });

    text += `\n*المجموع الفرعي:* ${order.subtotal} ج.م\n`;
    if (order.discountAmount > 0) {
      text += `*خصم الكمية (${order.discountRate}%):* -${order.discountAmount} ج.م\n`;
    }
    if (order.freeStickersAwarded > 0) {
      text += `*هدية استيكرات مجانية:* ${order.freeStickersAwarded} استيكرات\n`;
    }
    if (order.shippingFee > 0) {
      text += `*تكلفة التوصيل:* ${order.shippingFee} ج.م\n`;
    }
    text += `*الإجمالي النهائي:* ${order.total} ج.م\n\n`;

    text += `*طريقة الاستلام:* ${order.deliveryType === 'pickup' ? `استلام من فرع (${branchLabel})` : `توصيل إلى (${order.addressDetails || 'العنوان'})`}\n`;
    text += `*وسيلة الدفع:* ${order.paymentMethod}\n`;
    text += `*بيانات العميل:* ${order.customerName} - ${order.customerPhone}\n`;

    return `https://wa.me/201507410800?text=${encodeURIComponent(text)}`;
  }
}

export const orderEngine = new OrderEngine();
