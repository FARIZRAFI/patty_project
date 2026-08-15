export interface CustomerAddress {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postcode: string;
  phone?: string;
  is_default: boolean;
  created_at?: string;
}
