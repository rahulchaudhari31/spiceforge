// src/core/json/facility-data.ts

export interface Facility {
  id: number;
  facility_code: string;
  name: string;
  type: 'production' | 'packaging' | 'warehouse' | 'cold_storage' | 'third_party';
  address: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  linked_warehouses: string[];
  production_lines: string[];
  tally_godown_code: string;
  status: 'active' | 'inactive';
  created_at: string;
}

// Mock data for testing
export const facilityData: Facility[] = [
  {
    id: 1,
    facility_code: 'FAC-001',
    name: 'Main Production Facility',
    type: 'production',
    address: '123 Industrial Ave, Los Angeles, CA 90001',
    contact_person: 'John Smith',
    contact_phone: '+1 (555) 123-4567',
    contact_email: 'john.smith@spiceforge.com',
    linked_warehouses: ['Main Warehouse', 'Cold Storage A'],
    production_lines: ['Line 1', 'Line 2', 'Line 3'],
    tally_godown_code: 'GOD-001',
    status: 'active',
    created_at: '2026-01-15 10:30:00'
  },
  {
    id: 2,
    facility_code: 'FAC-002',
    name: 'Packaging Unit A',
    type: 'packaging',
    address: '456 Packaging Blvd, New York, NY 10001',
    contact_person: 'Sarah Johnson',
    contact_phone: '+1 (555) 234-5678',
    contact_email: 'sarah.johnson@spiceforge.com',
    linked_warehouses: ['Secondary Warehouse'],
    production_lines: ['Pack Line 1', 'Pack Line 2'],
    tally_godown_code: 'GOD-002',
    status: 'active',
    created_at: '2026-02-20 14:15:00'
  },
  {
    id: 3,
    facility_code: 'FAC-003',
    name: 'Central Warehouse',
    type: 'warehouse',
    address: '789 Storage Rd, Houston, TX 77001',
    contact_person: 'Michael Brown',
    contact_phone: '+1 (555) 345-6789',
    contact_email: 'michael.brown@spiceforge.com',
    linked_warehouses: [],
    production_lines: [],
    tally_godown_code: 'GOD-003',
    status: 'active',
    created_at: '2026-03-10 09:00:00'
  },
  {
    id: 4,
    facility_code: 'FAC-004',
    name: 'Cold Storage Facility',
    type: 'cold_storage',
    address: '321 Cold Chain St, Chicago, IL 60601',
    contact_person: 'Emily Davis',
    contact_phone: '+1 (555) 456-7890',
    contact_email: 'emily.davis@spiceforge.com',
    linked_warehouses: [],
    production_lines: [],
    tally_godown_code: 'GOD-004',
    status: 'active',
    created_at: '2026-04-05 11:45:00'
  },
  {
    id: 5,
    facility_code: 'FAC-005',
    name: 'Third Party Storage - North',
    type: 'third_party',
    address: '555 Logistics Way, Dallas, TX 75201',
    contact_person: 'David Wilson',
    contact_phone: '+1 (555) 567-8901',
    contact_email: 'david.wilson@spiceforge.com',
    linked_warehouses: [],
    production_lines: [],
    tally_godown_code: 'GOD-005',
    status: 'inactive',
    created_at: '2026-05-12 13:20:00'
  }
];