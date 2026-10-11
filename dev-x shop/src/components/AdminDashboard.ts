// Dev-X Admin Dashboard Controller & View Generator

import { Order, OrderStatus, UserProfile } from '../lib/types';
import { orderEngine } from '../lib/orderEngine';
import { inventoryEngine } from '../lib/inventoryEngine';
import { BRANCHES, PRODUCTS } from '../lib/data';

export class AdminDashboard {
  private activeTab: 'overview' | 'orders' | 'inventory' | 'branches' | 'audit' = 'overview';

  /**
   * Renders the complete, protected Admin Dashboard UI
   */
  public render(currentUser: UserProfile): string {
    // RBAC Security Check
    const privilegedRoles = ['admin', 'super_admin', 'branch_manager', 'operations', 'content_manager'];
    if (!privilegedRoles.includes(currentUser.role)) {
      return `
        <div class="cd" style="padding: 30px; text-align: center; max-width: 600px; margin: 40px auto;">
          <h2 style="color: var(--er);">⚠️ الوصول غير مصرح به (403 Forbidden)</h2>
          <p class="mu" style="margin: 14px 0;">هذه اللوحة مخصصة لإدارة متجر Dev-X وتتطلب صلاحيات إدارية أو إدارة فرع.</p>
          <a href="#home" class="btn">العودة للمتجر الرئيسي</a>
        </div>
      `;
    }

    const isBranchManager = currentUser.role === 'branch_manager';
    const assignedBranch = isBranchManager ? currentUser.preferredBranch : undefined;
    const orders = orderEngine.getOrders(assignedBranch);
    const movements = inventoryEngine.getMovements(assignedBranch);

    // Business KPIs
    const totalOrdersCount = orders.length;
    const totalGrossSales = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;

    return `
      <div class="pgin" style="max-width: 1180px; margin: auto; padding: 14px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
          <div>
            <h1 style="margin: 0; font-size: 24px;">لوحة تحكم إدارة متجر Dev-X ⚙️</h1>
            <p class="mu" style="margin: 4px 0;">
              المستخدم: <b>${currentUser.name}</b> (${currentUser.role})
              ${assignedBranch ? ` | الفرع: <b>${assignedBranch}</b>` : ' | كافة الفروع'}
            </p>
          </div>
          <div>
            <a href="#home" class="btn s l">العودة للواجهة الرئيسية</a>
          </div>
        </div>

        <!-- KPI Metrics Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 24px;">
          <div class="cd" style="padding: 18px; text-align: center;">
            <span class="mu" style="font-size: 13px;">إجمالي الطلبات</span>
            <b style="display: block; font-size: 28px; color: var(--bl); margin-top: 6px;">${totalOrdersCount}</b>
          </div>
          <div class="cd" style="padding: 18px; text-align: center;">
            <span class="mu" style="font-size: 13px;">إجمالي المبيعات المؤكدة</span>
            <b style="display: block; font-size: 28px; color: var(--ok); margin-top: 6px;">${totalGrossSales} ج.م</b>
          </div>
          <div class="cd" style="padding: 18px; text-align: center;">
            <span class="mu" style="font-size: 13px;">طلبات قيد المراجعة</span>
            <b style="display: block; font-size: 28px; color: var(--y); margin-top: 6px;">${pendingOrders}</b>
          </div>
          <div class="cd" style="padding: 18px; text-align: center;">
            <span class="mu" style="font-size: 13px;">الطلبات المدفوعة</span>
            <b style="display: block; font-size: 28px; color: var(--pk); margin-top: 6px;">${paidOrders}</b>
          </div>
        </div>

        <!-- Orders Management Section -->
        <div class="cd" style="padding: 20px; margin-bottom: 24px;">
          <h2 style="font-size: 18px; margin-bottom: 14px;">سجل الطلبات الأخير 📦</h2>
          <div style="overflow-x: auto;">
            <table class="tb" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="text-align: start; border-bottom: 2px solid var(--bd);">
                  <th style="padding: 8px;">رقم الطلب</th>
                  <th style="padding: 8px;">العميل</th>
                  <th style="padding: 8px;">الاستلام</th>
                  <th style="padding: 8px;">الإجمالي</th>
                  <th style="padding: 8px;">الدفع</th>
                  <th style="padding: 8px;">الحالة</th>
                  <th style="padding: 8px;">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td style="padding: 10px 8px; font-weight: 700;">${o.orderNumber}</td>
                    <td style="padding: 10px 8px;">${o.customerName}<br><small class="mu">${o.customerPhone}</small></td>
                    <td style="padding: 10px 8px;">${o.deliveryType === 'pickup' ? `استلام (${o.branchId})` : 'توصيل'}</td>
                    <td style="padding: 10px 8px; font-weight: 700; color: var(--bl);">${o.total} ج.م</td>
                    <td style="padding: 10px 8px;"><span class="chip" style="font-size: 11px;">${o.paymentStatus}</span></td>
                    <td style="padding: 10px 8px;"><span class="chip on" style="font-size: 11px;">${o.orderStatus}</span></td>
                    <td style="padding: 10px 8px; font-size: 12px;" class="mu">${new Date(o.createdAt).toLocaleDateString('ar-EG')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Stock Audit & Movements Ledger -->
        <div class="cd" style="padding: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 14px;">سجل حركات المخزون والتدقيق (Immutable Audit Ledger) 📋</h2>
          <div style="overflow-x: auto;">
            <table class="tb" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="text-align: start; border-bottom: 2px solid var(--bd);">
                  <th style="padding: 8px;">كود الحركة</th>
                  <th style="padding: 8px;">الفرع</th>
                  <th style="padding: 8px;">المنتج</th>
                  <th style="padding: 8px;">المقدار</th>
                  <th style="padding: 8px;">السبب</th>
                  <th style="padding: 8px;">المسؤول</th>
                  <th style="padding: 8px;">التوقيت</th>
                </tr>
              </thead>
              <tbody>
                ${movements.length > 0 ? movements.map(m => `
                  <tr>
                    <td style="padding: 10px 8px; font-family: monospace;">${m.id}</td>
                    <td style="padding: 10px 8px;">${m.branchId}</td>
                    <td style="padding: 10px 8px;">${m.productId}${m.variantSize ? ` (${m.variantSize})` : ''}</td>
                    <td style="padding: 10px 8px; font-weight: 700; color: ${m.delta >= 0 ? 'var(--ok)' : 'var(--er)'};">
                      ${m.delta > 0 ? `+${m.delta}` : m.delta}
                    </td>
                    <td style="padding: 10px 8px;">${m.reason}</td>
                    <td style="padding: 10px 8px; font-size: 12px;" class="mu">${m.performedBy}</td>
                    <td style="padding: 10px 8px; font-size: 12px;" class="mu">${new Date(m.timestamp).toLocaleTimeString('ar-EG')}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;" class="mu">لا توجد حركات مخزون مسجلة حتى الآن.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

export const adminDashboard = new AdminDashboard();
