// src/feature-module/quality-control/vehicle-inspection/types/index.ts

export interface VehicleInspection {
  id: number;
  inspection_type: 'loading' | 'unloading';
  location: string;
  vehicle_no: string;
  date: string;
  time: string;
  
  // Inspection Parameters
  vehicle_condition: 'clean' | 'unclean' | 'na';
  insects: 'yes' | 'no' | 'na';
  undesirable_odour: 'yes' | 'no' | 'na';
  nail_bolt_projection: 'yes' | 'no' | 'na';
  covered_from_top: 'yes' | 'no' | 'na';
  camera_check: 'yes' | 'no' | 'na';
  proper_holding_rope: 'yes' | 'no' | 'na';
  
  // Additional Details
  floorboard_ok: 'yes' | 'no' | 'na';
  waste_spoilage: 'yes' | 'no' | 'na';
  oil_grease_chemicals: 'yes' | 'no' | 'na';
  garbage: 'yes' | 'no' | 'na';
  insect_rodent_activity: 'yes' | 'no' | 'na';
  bad_odour: 'yes' | 'no' | 'na';
  
  observation: string;
  remarks: string;
  
  // Status & Audit
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revised';
  checked_by: number;
  verified_by: number;
  reviewed_by: number;
  approved_by: number;
  reviewed_at: string;
  approved_at: string;
  
  // Locking
  is_locked: boolean;
  locked_at: string;
  locked_by: number;
  
  // Relations
  items: InspectionItem[];
  audit_logs: AuditLog[];
  
  created_at: string;
  updated_at: string;
}

export interface InspectionItem {
  id: number;
  inspection_id: number;
  material_name: string;
  lot_number: string;
  quantity: number;
  unit: string;
  remark: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  inspection_id: number;
  action: string;
  performed_by: number;
  performed_by_name: string;
  old_status: string;
  new_status: string;
  comment: string;
  created_at: string;
}

export interface InspectionFilters {
  status?: string;
  vehicle_no?: string;
  date_from?: string;
  date_to?: string;
  inspection_type?: string;
  search?: string;        
  per_page?: number;      
  page?: number;          
}