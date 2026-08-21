export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'CUSTOMER';
  is_active: boolean;
  branch_ids: string[];
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address_line1: string;
  postcode: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  delivery_enabled: boolean;
  collection_enabled: boolean;
  ordering_enabled: boolean;
  delivery_radius_miles: number;
  opening_hours?: any;
  is_active: boolean;
}


export interface ProductModifier {
  id: string;
  name: string;
  price: number;
  is_required: boolean;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  sku: string;
  short_description?: string;
  full_description?: string;
  allergens?: string;
  ingredients?: string[];
  image_url?: string;

  images?: string[];
  base_price: number;
  compare_at_price?: number;
  rating: number;
  reviews_count: number;
  is_bestseller: boolean;
  has_tax: boolean;
  has_service_charge: boolean;
  vat_category: string;
  is_active: boolean;
  is_available?: boolean;
  modifiers: ProductModifier[];
  stock_quantity?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  display_order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedModifiers: ProductModifier[];
  lineTotal: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_modifiers?: { name: string; price?: number }[];
}

export interface OrderStatusHistory {
  id: string;
  from_status?: string;
  to_status: string;
  notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  branch_id: string;
  order_type: 'DELIVERY' | 'COLLECTION';
  status: string;
  delivery_address?: any;
  collection_slot_time?: string;
  delivery_instructions?: string;
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  discount_amount: number;
  vat_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  payment_transaction_id?: string;
  coupon_code?: string;
  points_earned: number;
  points_redeemed: number;
  created_at: string;
  items: OrderItem[];
  status_history: OrderStatusHistory[];
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  coupon_type: string;
  discount_value: number;
  min_order_value: number;
  usage_limit: number;
  used_count: number;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description?: string;
  points_required: number;
  reward_type: string;
  discount_value?: number;
  product_id?: string;
}
