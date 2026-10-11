// Dev-X Payment Gateways & Adapters

import { PaymentMethodId, PaymentStatus } from './types';

export interface PaymentProcessResult {
  success: boolean;
  transactionReference: string;
  paymentStatus: PaymentStatus;
  redirectUrl?: string;
  instructionsAr?: string;
  instructionsEn?: string;
  errorMessage?: string;
}

export interface PaymentGatewayAdapter {
  id: PaymentMethodId;
  name: string;
  isAvailable: boolean;
  processPayment(orderNumber: string, amount: number, customerPhone: string): Promise<PaymentProcessResult>;
  verifyWebhookSignature(payload: any, signature: string): boolean;
}

// 1. Vodafone Cash Adapter
export class VodafoneCashAdapter implements PaymentGatewayAdapter {
  id: PaymentMethodId = 'vodafone';
  name = 'Vodafone Cash';
  isAvailable = true;

  async processPayment(orderNumber: string, amount: number, customerPhone: string): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionReference: 'VF-' + Date.now(),
      paymentStatus: 'pending',
      instructionsAr: `يرجى تحويل مبلغ ${amount} ج.م إلى رقم فودافون كاش 01507410800 وتأكيد رسالة التحويل مع رقم الطلب ${orderNumber}`,
      instructionsEn: `Please transfer EGP ${amount} to Vodafone Cash number 01507410800 and send confirmation with order ${orderNumber}`
    };
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    // In production, compute HMAC-SHA256 with PAYMOB/GATEWAY_SECRET
    return true;
  }
}

// 2. InstaPay Adapter
export class InstaPayAdapter implements PaymentGatewayAdapter {
  id: PaymentMethodId = 'instapay';
  name = 'InstaPay Egypt';
  isAvailable = true;

  async processPayment(orderNumber: string, amount: number): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionReference: 'IP-' + Date.now(),
      paymentStatus: 'pending',
      instructionsAr: `يرجى التحويل عبر إنستاباي إلى عنوان الدفع (IPA) المعتمد: devx@instapay مع تدوين رقم الطلب ${orderNumber}`,
      instructionsEn: `Please transfer via InstaPay to (IPA): devx@instapay mentioning order number ${orderNumber}`
    };
  }

  verifyWebhookSignature(): boolean {
    return true;
  }
}

// 3. Fawry Adapter
export class FawryAdapter implements PaymentGatewayAdapter {
  id: PaymentMethodId = 'fawry';
  name = 'Fawry Pay';
  isAvailable = true;

  async processPayment(orderNumber: string, amount: number): Promise<PaymentProcessResult> {
    const fawryRefNumber = '98' + Math.floor(100000 + Math.random() * 900000);
    return {
      success: true,
      transactionReference: fawryRefNumber,
      paymentStatus: 'pending',
      instructionsAr: `رقم مرجع فوري الخاص بك: ${fawryRefNumber}. صالح للدفع لمدة 48 ساعة في أي منفذ فوري.`,
      instructionsEn: `Your Fawry Reference Number: ${fawryRefNumber}. Valid for 48 hours at any Fawry retail outlet.`
    };
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    return true;
  }
}

// 4. Cash on Delivery (COD) Adapter
export class CashOnDeliveryAdapter implements PaymentGatewayAdapter {
  id: PaymentMethodId = 'cod';
  name = 'Cash on Delivery';
  isAvailable = true;

  async processPayment(orderNumber: string, amount: number): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionReference: 'COD-' + orderNumber,
      paymentStatus: 'unpaid',
      instructionsAr: `سيتم تحصيل مبلغ ${amount} ج.م نقداً عند استلام الطلب من الفرع أو المندوب.`,
      instructionsEn: `EGP ${amount} will be collected in cash upon delivery or branch pickup.`
    };
  }

  verifyWebhookSignature(): boolean {
    return true;
  }
}

export const paymentAdapters: Record<PaymentMethodId, PaymentGatewayAdapter> = {
  vodafone: new VodafoneCashAdapter(),
  instapay: new InstaPayAdapter(),
  fawry: new FawryAdapter(),
  cod: new CashOnDeliveryAdapter(),
  etisalat: new VodafoneCashAdapter(), // Compatible mobile wallet flow
  card: new FawryAdapter(), // Electronic card flow
  bank: new InstaPayAdapter()
};
