import { create } from 'zustand';
import { CartItem, Product, ProductModifier, Branch } from '../types';

interface CartState {
  items: CartItem[];
  orderType: 'DELIVERY' | 'COLLECTION';
  selectedBranch: Branch | null;
  nearestBranchForCollection: Branch | null;
  deliveryDistanceMiles: number | null;
  isDeliveryEligible: boolean;
  userCoords: { lat: number; lng: number; accuracy?: number } | null;
  userPostcode: string | null;
  locationErrorMsg: string | null;
  couponCode: string | null;
  discountAmount: number;
  isProductModalOpen: boolean;
  
  setOrderType: (type: 'DELIVERY' | 'COLLECTION') => void;
  setSelectedBranch: (
    branch: Branch | null,
    distanceMiles?: number | null,
    isEligible?: boolean,
    nearestBranch?: Branch | null,
    locationMsg?: string | null,
    coords?: { lat: number; lng: number; accuracy?: number } | null,
    postcode?: string | null
  ) => void;
  setUserCoords: (coords: { lat: number; lng: number; accuracy?: number } | null, postcode?: string | null) => void;
  setLocationErrorMsg: (msg: string | null) => void;
  setProductModalOpen: (open: boolean) => void;
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

const getInitialBranch = (): Branch | null => {
  try {
    const raw = localStorage.getItem('patty_selected_branch');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialBranch = getInitialBranch();

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orderType: 'COLLECTION', // FAIL-CLOSED DEFAULT: Starts on COLLECTION until <= 2.0 miles is verified
  selectedBranch: initialBranch,
  nearestBranchForCollection: initialBranch,
  deliveryDistanceMiles: null,
  isDeliveryEligible: false,
  userCoords: null,
  userPostcode: null,
  locationErrorMsg: null,
  couponCode: null,
  discountAmount: 0,
  isProductModalOpen: false,

  setOrderType: (type) => {
    const { isDeliveryEligible, deliveryDistanceMiles } = get();
    // Non-negotiable rule: Delivery can ONLY be selected if isDeliveryEligible is true AND distance <= 2.0 miles
    if (type === 'DELIVERY' && (!isDeliveryEligible || (deliveryDistanceMiles !== null && deliveryDistanceMiles > 2.0))) {
      set({ orderType: 'COLLECTION' });
      return;
    }
    set({ orderType: type });
  },

  setSelectedBranch: (branch, distanceMiles, isEligible, nearestBranch, locationMsg, coords, postcode) => {
    const dist = distanceMiles ?? null;
    const eligible = Boolean(isEligible ?? (dist !== null && dist <= 2.0));
    const effectiveBranch = branch ?? nearestBranch ?? null;

    try {
      if (effectiveBranch) {
        localStorage.setItem('patty_selected_branch', JSON.stringify(effectiveBranch));
      } else {
        localStorage.removeItem('patty_selected_branch');
      }
    } catch {}

    set({
      selectedBranch: effectiveBranch,
      nearestBranchForCollection: nearestBranch || effectiveBranch,
      deliveryDistanceMiles: dist,
      isDeliveryEligible: eligible,
      orderType: eligible ? get().orderType : 'COLLECTION', // Auto-switch to COLLECTION if outside 2 miles
      locationErrorMsg: locationMsg || (eligible ? null : 'WE PROVIDE DELIVERY UP TO 2 MILES ONLY'),
      userCoords: coords !== undefined ? coords : get().userCoords,
      userPostcode: postcode !== undefined ? postcode : get().userPostcode
    });
  },

  setUserCoords: (coords, postcode) => set({ userCoords: coords, userPostcode: postcode ?? get().userPostcode }),

  setLocationErrorMsg: (msg) => set({ locationErrorMsg: msg }),

  setProductModalOpen: (open) => set({ isProductModalOpen: open }),

  addItem: (product, quantity, selectedModifiers) => {
    const isOutOfStock = product.is_available === false || (product.stock_quantity !== undefined && product.stock_quantity <= 0);
    if (isOutOfStock) return;

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
