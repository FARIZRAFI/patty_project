export interface CustomerCard {
  id: string;
  user_id: string;
  card_brand: string; // "Mastercard", "Visa", "RuPay", "Amex"
  last4: string;
  cardholder_name: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
  created_at?: string;
}
