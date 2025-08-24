export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}
