import { Address } from './address';

export type ShipmentStatus = 
  | 'pending'
  | 'processing'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'returned'
  | 'cancelled';

export interface PackageItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
}

export interface DeliveryAttempt {
  id: string;
  timestamp: string;
  status: string;
  notes?: string;
}

export interface TrackingUpdate {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string;
  description?: string;
  timestamp: string;
}

export interface ShipmentDimensions {
  length: number;
  width: number;
  height: number;
}

export interface Shipment {
  id: string;
  order_id: string;
  tracking_number: string;
  carrier_name: string;
  status: ShipmentStatus;
  weight: number;
  dimensions?: ShipmentDimensions;
  pickup_address: Address;
  delivery_address: Address;
  estimated_delivery_date?: string;
  is_insured: boolean;
  insurance_amount: number;
  package_items: PackageItem[];
  delivery_attempts: DeliveryAttempt[];
  tracking_updates: TrackingUpdate[];
  created_at: string;
  updated_at: string;
}
