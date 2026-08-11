// src/feature-module/people/customers/types/index.ts

export interface Customer {
  id: number;
  customer_code: string;
  customer_name: string;
  customer_type: 'individual' | 'company' | 'retailer' | 'wholesaler';
  gst_number?: string;
  pan_number?: string;
  email: string;
  phone: string;
  address?: string;
  contact_person?: string;
  tally_ledger_code?: string;
  tally_ledger_name?: string;
  tally_sync_status: 'pending' | 'synced' | 'error';
  tally_last_synced_at?: string;
  xml_export_status: 'pending' | 'exported' | 'error';
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  dispatch_locations?: DispatchLocation[];
  delivery_requirements?: DeliveryRequirement | null;
}

export interface DispatchLocation {
  id: number;
  customer_id: number;
  location_code: string;
  location_name: string;
  address: string;
  contact_person?: string;
  phone?: string;
  is_default: boolean;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryRequirement {
  id: number;
  customer_id: number;
  delivery_type: 'express' | 'standard' | 'scheduled';
  time_slot?: string;
  special_instructions?: string;
  preferred_carrier?: string;
  delivery_zone?: string;
  created_at?: string;
  updated_at?: string;
}