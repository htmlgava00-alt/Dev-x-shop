// Dev-X Inventory & Branch Stock Ledger Engine

import { Branch, InventoryMovement, Product, TShirtSize, UserProfile } from './types';
import { BRANCHES, PRODUCTS } from './data';

export interface BranchStockMap {
  [branchId: string]: {
    [productId: string]: {
      [sizeKey: string]: number; // 'default' for non-sized, or 'S', 'M', 'L', etc.
    };
  };
}

export class InventoryEngine {
  private stockMap: BranchStockMap = {};
  private movementLedger: InventoryMovement[] = [];

  constructor() {
    this.seedInitialInventory();
  }

  private seedInitialInventory() {
    // Seed default baseline stock for each branch
    BRANCHES.forEach(branch => {
      this.stockMap[branch.id] = {};
      PRODUCTS.forEach(product => {
        this.stockMap[branch.id][product.id] = {};
        if (product.sz && product.sizes) {
          product.sizes.forEach(sz => {
            // Realistic dev seed quantities per size
            this.stockMap[branch.id][product.id][sz] = 15;
          });
        } else {
          this.stockMap[branch.id][product.id]['default'] = 25;
        }
      });
    });
  }

  public getAvailableStock(branchId: string, productId: string, size?: TShirtSize): number {
    const sizeKey = size || 'default';
    return this.stockMap[branchId]?.[productId]?.[sizeKey] || 0;
  }

  /**
   * Adjust stock with mandatory audit logging and negative stock protection.
   */
  public adjustStock(
    branchId: string,
    productId: string,
    delta: number,
    reason: string,
    user: UserProfile,
    size?: TShirtSize,
    type: 'sale' | 'restock' | 'transfer' | 'return' | 'adjustment' = 'adjustment'
  ): { success: boolean; error?: string } {
    // Branch manager scope validation
    if (user.role === 'branch_manager' && user.preferredBranch !== branchId) {
      return { success: false, error: 'Unauthorized: Branch managers may only modify stock for their designated branch.' };
    }

    const sizeKey = size || 'default';
    const currentStock = this.getAvailableStock(branchId, productId, size);
    const newStock = currentStock + delta;

    if (newStock < 0) {
      return { success: false, error: 'Insufficient stock: Action would result in negative inventory.' };
    }

    if (!this.stockMap[branchId]) this.stockMap[branchId] = {};
    if (!this.stockMap[branchId][productId]) this.stockMap[branchId][productId] = {};
    
    this.stockMap[branchId][productId][sizeKey] = newStock;

    // Record immutable audit movement
    const movement: InventoryMovement = {
      id: 'MOV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      branchId,
      productId,
      variantSize: size,
      delta,
      reason,
      type,
      timestamp: new Date().toISOString(),
      performedBy: `${user.name} (${user.role})`
    };

    this.movementLedger.unshift(movement);
    return { success: true };
  }

  /**
   * Safe Inter-branch stock transfer with audit trail
   */
  public transferStock(
    fromBranchId: string,
    toBranchId: string,
    productId: string,
    qty: number,
    user: UserProfile,
    size?: TShirtSize
  ): { success: boolean; error?: string } {
    if (qty <= 0) return { success: false, error: 'Transfer quantity must be positive.' };
    
    const available = this.getAvailableStock(fromBranchId, productId, size);
    if (available < qty) {
      return { success: false, error: `Transfer failed: Source branch only has ${available} items available.` };
    }

    // Decrement from source
    const deductRes = this.adjustStock(
      fromBranchId, 
      productId, 
      -qty, 
      `Transfer out to branch ${toBranchId}`, 
      user, 
      size, 
      'transfer'
    );
    if (!deductRes.success) return deductRes;

    // Increment destination
    const addRes = this.adjustStock(
      toBranchId, 
      productId, 
      qty, 
      `Transfer in from branch ${fromBranchId}`, 
      user, 
      size, 
      'transfer'
    );
    return addRes;
  }

  public getMovements(branchId?: string): InventoryMovement[] {
    if (branchId) {
      return this.movementLedger.filter(m => m.branchId === branchId);
    }
    return this.movementLedger;
  }
}

export const inventoryEngine = new InventoryEngine();
