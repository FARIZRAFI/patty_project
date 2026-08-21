import { create } from 'zustand';
import { CartItem, Product, ProductModifier, Branch } from '../types';

interface CartState {
  items: CartItem[];
  orderType: 'DELIVERY' | 'COLLECTION';
  selectedBranch: Branch | null;
  deliveryDistanceMiles: number | null;
  couponCode: string | null;
  discountAmount: number;
  
  setOrderType: (type: 'DELIVERY' | 'COLLECTION') => void;
  setSelectedBranch: (branch: Branch | null, distanceMiles?: number) => void;
  addItem: (product: Product, quantity: number, selectedModifiers: ProductModifier[]) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orderType: 'DELIVERY',
  selectedBranch: null,
  deliveryDistanceMiles: null,
  couponCode: null,
  discountAmount: 0,

  setOrderType: (type) => set({ orderType: type }),
  setSelectedBranch: (branch, distanceMiles) => set({ selectedBranch: branch, deliveryDistanceMiles: distanceMiles || null }),

  addItem: (product, quantity, selectedModifiers) => {
    const modCost = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
    const unitPrice = product.base_price + modCost;
    const lineTotal = unitPrice * quantity;

    set((state) => ({
      items: [...state.items, { product, quantity, selectedModifiers, lineTotal }]
    }));
  },

  updateQuantity: (index, quantity) => {
    if (quantity <= 0) {
      get().removeItem(index);
      return;
    }
    set((state) => {
      const newItems = [...state.items];
      const item = newItems[index];
      const modCost = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
      const unitPrice = item.product.base_price + modCost;
      newItems[index] = {
        ...item,
        quantity,
        lineTotal: unitPrice * quantity
      };
      return { items: newItems };
    });
  },

  removeItem: (index) => {
    set((state) => ({
      items: state.items.filter((_, i) => i !== index)
    }));
  },

  applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),
  removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
  clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.lineTotal, 0);
  },

  getDeliveryFee: () => {
    // Patty Project delivery is FREE (£0.00). 2-mile radius is purely an eligibility check.
    return 0.0;
  },


  getServiceFee: () => {
    return get().items.length > 0 ? 0.99 : 0.0;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const delivery = get().getDeliveryFee();
    const service = get().getServiceFee();
    const discount = get().discountAmount;
    return Math.max(0, subtotal - discount + delivery + service);
  }
}));
