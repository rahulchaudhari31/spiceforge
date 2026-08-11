// src/mock/mockApi.ts
// In-browser mock implementation of the SpiceForge Laravel API.
// Every handler returns the same envelope the real backend returns
// (e.g. { success, data, message }) so the service layer works unchanged.

import { db, saveDB, nextId, makePaginator, matchesSearch, now } from './db';
import type { Customer, DispatchLocation, DeliveryRequirement } from '../feature-module/people/customers/types';
import type { Facility } from '../core/json/facility-data';
import type { VehicleInspection, AuditLog } from '../feature-module/quality-control/vehicle-inspection/types';

export interface MockRequestOptions {
  method: string;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  responseType?: string;
}

const ok = (data?: unknown, message = 'Success') => ({ success: true, data, message });
const fail = (message: string) => ({ success: false, message });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const asRecord = (value: unknown): Record<string, any> =>
  value && typeof value === 'object' ? (value as Record<string, any>) : {};

const currentUserId = (): number => {
  if (typeof window !== 'undefined') {
    try {
      const user = JSON.parse(window.localStorage.getItem('current_user') || '{}');
      if (user && typeof user.id === 'number') return user.id;
    } catch {
      // ignore
    }
  }
  return 1;
};

const currentUserName = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const user = JSON.parse(window.localStorage.getItem('current_user') || '{}');
      if (user && typeof user.name === 'string') return user.name;
    } catch {
      // ignore
    }
  }
  return 'Demo User';
};

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

const customerSearchValues = (c: Customer): Array<string | undefined> => [
  c.customer_name,
  c.customer_code,
  c.email,
  c.phone,
  c.contact_person,
];

const filterCustomers = (query: Record<string, any>): Customer[] => {
  const search = String(query.search || '').toLowerCase();
  let list = db.customers.filter((c) => {
    if (search && !matchesSearch(customerSearchValues(c), search)) return false;
    if (query.status && c.status !== query.status) return false;
    if (query.customer_type && c.customer_type !== query.customer_type) return false;
    return true;
  });
  list = [...list].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  return list;
};

const toLookup = (c: Customer) => ({
  id: c.id,
  customer_code: c.customer_code,
  customer_name: c.customer_name,
  customer_type: c.customer_type,
  email: c.email,
  phone: c.phone,
  status: c.status,
});

const handleCustomers = async (method: string, segments: string[], query: Record<string, any>, body: unknown) => {
  const id = segments[1] ? Number(segments[1]) : NaN;
  const sub = segments[2];

  // GET /customers
  if (segments.length === 1 && method === 'get') {
    const filtered = filterCustomers(query);
    const perPage = Number(query.per_page) || 10;
    const page = Number(query.page) || 1;
    return ok(makePaginator(filtered, page, perPage), 'Customers fetched successfully');
  }

  // POST /customers
  if (segments.length === 1 && method === 'post') {
    const payload = asRecord(body);
    const customer: Customer = {
      id: nextId(db.customers),
      customer_code: payload.customer_code || `CUST-${String(nextId(db.customers)).padStart(3, '0')}`,
      customer_name: payload.customer_name || 'Untitled Customer',
      customer_type: payload.customer_type || 'company',
      email: payload.email || '',
      phone: payload.phone || '',
      address: payload.address || '',
      contact_person: payload.contact_person || '',
      tally_ledger_code: payload.tally_ledger_code || '',
      tally_ledger_name: payload.tally_ledger_name || '',
      tally_sync_status: 'pending',
      xml_export_status: 'pending',
      status: payload.status || 'active',
      gst_number: payload.gst_number || '',
      pan_number: payload.pan_number || '',
      created_at: now(),
      updated_at: now(),
      dispatch_locations: [],
      delivery_requirements: null,
    };
    db.customers.unshift(customer);
    saveDB();
    return ok(customer, 'Customer created successfully');
  }

  // GET /customers/lookup
  if (id === 0 && sub === 'lookup' && method === 'get') {
    return ok(db.customers.map(toLookup), 'Customers fetched successfully');
  }

  // POST /customers/bulk-delete
  if (id === 0 && sub === 'bulk-delete' && method === 'post') {
    const ids = asRecord(body).ids;
    if (Array.isArray(ids)) {
      db.customers = db.customers.filter((c) => !ids.includes(c.id));
      saveDB();
    }
    return ok(null, 'Customers deleted successfully');
  }

  if (Number.isNaN(id)) return fail('Invalid customer id');

  const customer = db.customers.find((c) => c.id === id);
  if (!customer) return fail('Customer not found');

  switch (sub) {
    case undefined: {
      // GET /customers/:id
      if (method === 'get') {
        return ok(customer, 'Customer fetched successfully');
      }
      // PUT /customers/:id
      if (method === 'put') {
        const payload = asRecord(body);
        Object.assign(customer, payload, { updated_at: now() });
        saveDB();
        return ok(customer, 'Customer updated successfully');
      }
      // DELETE /customers/:id
      if (method === 'delete') {
        db.customers = db.customers.filter((c) => c.id !== id);
        saveDB();
        return ok(null, 'Customer deleted successfully');
      }
      return fail('Method not supported');
    }

    case 'dispatch-locations': {
      if (method === 'get') {
        return ok(customer.dispatch_locations || [], 'Dispatch locations fetched successfully');
      }
      if (method === 'post') {
        const payload = asRecord(body);
        const location: DispatchLocation = {
          id: nextId((customer.dispatch_locations || []).map((l) => ({ id: l.id }))),
          customer_id: id,
          location_code: payload.location_code || `LOC-${String(nextId(db.customers)).padStart(3, '0')}`,
          location_name: payload.location_name || 'New Location',
          address: payload.address || '',
          contact_person: payload.contact_person || '',
          phone: payload.phone || '',
          is_default: !!payload.is_default,
          status: payload.status || 'active',
          created_at: now(),
          updated_at: now(),
        };
        customer.dispatch_locations = [...(customer.dispatch_locations || []), location];
        saveDB();
        return ok(location, 'Dispatch location added successfully');
      }
      return fail('Method not supported');
    }

    case 'delivery-requirements': {
      if (method === 'get') {
        return ok(customer.delivery_requirements || null, 'Delivery requirements fetched successfully');
      }
      if (method === 'put') {
        const payload = asRecord(body);
        const existing = customer.delivery_requirements;
        const requirements: DeliveryRequirement = {
          id: existing?.id || nextId([...(db.customers.flatMap((c) => (c.delivery_requirements ? [c.delivery_requirements] : []))).map((r) => ({ id: r.id }))]),
          customer_id: id,
          delivery_type: payload.delivery_type || existing?.delivery_type || 'standard',
          time_slot: payload.time_slot ?? existing?.time_slot ?? '',
          special_instructions: payload.special_instructions ?? existing?.special_instructions ?? '',
          preferred_carrier: payload.preferred_carrier ?? existing?.preferred_carrier ?? '',
          delivery_zone: payload.delivery_zone ?? existing?.delivery_zone ?? '',
          created_at: existing?.created_at || now(),
          updated_at: now(),
        };
        customer.delivery_requirements = requirements;
        saveDB();
        return ok(requirements, 'Delivery requirements saved successfully');
      }
      return fail('Method not supported');
    }

    case 'tally-mapping': {
      if (method === 'get') {
        return ok(
          customer.tally_ledger_code
            ? { tally_ledger_code: customer.tally_ledger_code, tally_ledger_name: customer.tally_ledger_name }
            : null,
          'Tally mapping fetched successfully'
        );
      }
      if (method === 'put') {
        const payload = asRecord(body);
        customer.tally_ledger_code = payload.tally_ledger_code ?? customer.tally_ledger_code;
        customer.tally_ledger_name = payload.tally_ledger_name ?? customer.tally_ledger_name;
        customer.tally_sync_status = 'synced';
        customer.tally_last_synced_at = now();
        customer.updated_at = now();
        saveDB();
        return ok(
          { tally_ledger_code: customer.tally_ledger_code, tally_ledger_name: customer.tally_ledger_name },
          'Tally mapping saved successfully'
        );
      }
      return fail('Method not supported');
    }

    case 'validate-tally': {
      if (method === 'post') {
        if (customer.tally_ledger_code && customer.tally_ledger_name) {
          return ok({ valid: true }, 'Tally mapping validated successfully');
        }
        return fail('Tally mapping is incomplete. Please save the ledger code and name first.');
      }
      return fail('Method not supported');
    }

    case 'export-xml': {
      if (method === 'get') {
        const xml = buildCustomerXml(customer);
        return new Blob([xml], { type: 'application/xml' });
      }
      return fail('Method not supported');
    }

    default:
      return fail(`Unknown customer endpoint: ${sub}`);
  }
};

const handleDispatchLocations = async (method: string, segments: string[], _query: Record<string, any>, body: unknown) => {
  const id = Number(segments[1]);
  if (Number.isNaN(id)) return fail('Invalid dispatch location id');

  for (const customer of db.customers) {
    const locations = customer.dispatch_locations || [];
    const idx = locations.findIndex((l) => l.id === id);
    if (idx === -1) continue;

    if (method === 'put') {
      const payload = asRecord(body);
      Object.assign(locations[idx], payload, { customer_id: customer.id, updated_at: now() });
      saveDB();
      return ok(locations[idx], 'Dispatch location updated successfully');
    }
    if (method === 'delete') {
      locations.splice(idx, 1);
      saveDB();
      return ok(null, 'Dispatch location deleted successfully');
    }
    return fail('Method not supported');
  }
  return fail('Dispatch location not found');
};

const buildCustomerXml = (customer: Customer): string => {
  const locations = (customer.dispatch_locations || [])
    .map(
      (l) => `  <dispatch_location>
    <location_code>${l.location_code}</location_code>
    <location_name>${l.location_name}</location_name>
    <address>${l.address}</address>
    <is_default>${l.is_default}</is_default>
  </dispatch_location>`
    )
    .join('\n');
  const requirements = customer.delivery_requirements
    ? `  <delivery_requirements>
    <delivery_type>${customer.delivery_requirements.delivery_type}</delivery_type>
    <delivery_zone>${customer.delivery_requirements.delivery_zone || ''}</delivery_zone>
    <preferred_carrier>${customer.delivery_requirements.preferred_carrier || ''}</preferred_carrier>
  </delivery_requirements>`
    : '  <delivery_requirements />';
  return `<?xml version="1.0" encoding="UTF-8"?>
<customer>
  <customer_code>${customer.customer_code}</customer_code>
  <customer_name>${customer.customer_name}</customer_name>
  <email>${customer.email}</email>
  <phone>${customer.phone}</phone>
  <gst_number>${customer.gst_number || ''}</gst_number>
  <pan_number>${customer.pan_number || ''}</pan_number>
  <tally_ledger_code>${customer.tally_ledger_code || ''}</tally_ledger_code>
  <tally_ledger_name>${customer.tally_ledger_name || ''}</tally_ledger_name>
${locations}
${requirements}
</customer>`;
};

// ---------------------------------------------------------------------------
// Facilities
// ---------------------------------------------------------------------------

const filterFacilities = (query: Record<string, any>): Facility[] => {
  const search = String(query.search || '').toLowerCase();
  return db.facilities.filter((f) => {
    if (search && !matchesSearch([f.name, f.facility_code, f.address, f.contact_person], search)) return false;
    if (query.type && f.type !== query.type) return false;
    if (query.status && f.status !== query.status) return false;
    return true;
  });
};

const handleFacilities = async (method: string, segments: string[], query: Record<string, any>, body: unknown) => {
  const id = segments[1] ? Number(segments[1]) : NaN;
  const sub = segments[2];

  // GET /facilities
  if (segments.length === 1 && method === 'get') {
    const filtered = filterFacilities(query);
    const perPage = Number(query.per_page) || 10;
    const page = Number(query.page) || 1;
    return ok(makePaginator(filtered, page, perPage), 'Facilities fetched successfully');
  }

  // GET /facilities/types
  if (id === 0 && sub === 'types' && method === 'get') {
    return ok(['production', 'packaging', 'warehouse', 'cold_storage', 'third_party'], 'Facility types fetched successfully');
  }

  // POST /facilities
  if (segments.length === 1 && method === 'post') {
    const payload = asRecord(body);
    const facility: Facility = {
      id: nextId(db.facilities),
      facility_code: payload.facility_code || `FAC-${String(nextId(db.facilities)).padStart(3, '0')}`,
      name: payload.name || 'Untitled Facility',
      type: payload.type || 'production',
      address: payload.address || '',
      contact_person: payload.contact_person || '',
      contact_phone: payload.contact_phone || '',
      contact_email: payload.contact_email || '',
      linked_warehouses: Array.isArray(payload.linked_warehouses) ? payload.linked_warehouses : [],
      production_lines: Array.isArray(payload.production_lines) ? payload.production_lines : [],
      tally_godown_code: payload.tally_godown_code || '',
      status: payload.status || 'active',
      created_at: now(),
    };
    db.facilities.unshift(facility);
    saveDB();
    return ok(facility, 'Facility created successfully');
  }

  if (Number.isNaN(id)) return fail('Invalid facility id');
  const facility = db.facilities.find((f) => f.id === id);
  if (!facility) return fail('Facility not found');

  switch (sub) {
    case undefined: {
      if (method === 'get') return ok(facility, 'Facility fetched successfully');
      if (method === 'put') {
        const payload = asRecord(body);
        Object.assign(facility, payload);
        saveDB();
        return ok(facility, 'Facility updated successfully');
      }
      if (method === 'delete') {
        db.facilities = db.facilities.filter((f) => f.id !== id);
        saveDB();
        return ok(null, 'Facility deleted successfully');
      }
      return fail('Method not supported');
    }

    case 'production-lines': {
      return ok(facility.production_lines, 'Production lines fetched successfully');
    }

    case 'tally-godowns': {
      return ok([facility.tally_godown_code].filter(Boolean), 'Tally godowns fetched successfully');
    }

    case 'link-warehouse': {
      if (method === 'post') {
        const warehouseId = String(asRecord(body).warehouse_id || '');
        if (warehouseId && !facility.linked_warehouses.includes(warehouseId)) {
          facility.linked_warehouses = [...facility.linked_warehouses, warehouseId];
          saveDB();
        }
        return ok(facility.linked_warehouses, 'Warehouse linked successfully');
      }
      return fail('Method not supported');
    }

    case 'unlink-warehouse': {
      if (method === 'delete') {
        const warehouseId = segments[3];
        facility.linked_warehouses = facility.linked_warehouses.filter((w) => w !== warehouseId);
        saveDB();
        return ok(facility.linked_warehouses, 'Warehouse unlinked successfully');
      }
      return fail('Method not supported');
    }

    default:
      return fail(`Unknown facility endpoint: ${sub}`);
  }
};

// ---------------------------------------------------------------------------
// Vehicle inspections
// ---------------------------------------------------------------------------

const inspectionSearchValues = (i: VehicleInspection): string[] => [
  i.vehicle_no,
  i.location,
  i.observation,
  i.remarks,
  i.inspection_type,
  i.status,
];

const filterInspections = (query: Record<string, any>): VehicleInspection[] => {
  const search = String(query.search || '').toLowerCase();
  return db.inspections.filter((i) => {
    if (search && !matchesSearch(inspectionSearchValues(i), search)) return false;
    if (query.status && i.status !== query.status) return false;
    if (query.inspection_type && i.inspection_type !== query.inspection_type) return false;
    if (query.vehicle_no && !i.vehicle_no.toLowerCase().includes(String(query.vehicle_no).toLowerCase())) return false;
    if (query.date_from && i.date < String(query.date_from)) return false;
    if (query.date_to && i.date > String(query.date_to)) return false;
    return true;
  });
};

const addAuditLog = (inspection: VehicleInspection, action: string, oldStatus: string, newStatus: string, comment = ''): void => {
  const log: AuditLog = {
    id: nextId(inspection.audit_logs.map((l) => ({ id: l.id }))),
    inspection_id: inspection.id,
    action,
    performed_by: currentUserId(),
    performed_by_name: currentUserName(),
    old_status: oldStatus,
    new_status: newStatus,
    comment,
    created_at: now(),
  };
  inspection.audit_logs = [...inspection.audit_logs, log];
};

const handleInspections = async (method: string, segments: string[], query: Record<string, any>, body: unknown) => {
  const id = segments[1] ? Number(segments[1]) : NaN;
  const sub = segments[2];

  // GET /vehicle-inspections
  if (segments.length === 1 && method === 'get') {
    const filtered = filterInspections(query);
    const perPage = Number(query.per_page) || 10;
    const page = Number(query.page) || 1;
    return ok(makePaginator(filtered, page, perPage), 'Inspections fetched successfully');
  }

  // POST /vehicle-inspections
  if (segments.length === 1 && method === 'post') {
    const payload = asRecord(body);
    const items = Array.isArray(payload.items)
      ? payload.items.map((item: Record<string, any>, index: number) => ({
          id: nextId(db.inspections.flatMap((i) => i.items.map((it) => ({ id: it.id })))) + index,
          inspection_id: 0,
          material_name: item.material_name || '',
          lot_number: item.lot_number || '',
          quantity: Number(item.quantity) || 0,
          unit: item.unit || 'kg',
          remark: item.remark || '',
          created_at: now(),
          updated_at: now(),
        }))
      : [];
    const inspection: VehicleInspection = {
      id: nextId(db.inspections),
      inspection_type: payload.inspection_type || 'loading',
      location: payload.location || '',
      vehicle_no: payload.vehicle_no || '',
      date: payload.date || now().slice(0, 10),
      time: payload.time || '',
      vehicle_condition: payload.vehicle_condition || 'clean',
      insects: payload.insects || 'no',
      undesirable_odour: payload.undesirable_odour || 'no',
      nail_bolt_projection: payload.nail_bolt_projection || 'no',
      covered_from_top: payload.covered_from_top || 'no',
      camera_check: payload.camera_check || 'no',
      proper_holding_rope: payload.proper_holding_rope || 'no',
      floorboard_ok: payload.floorboard_ok || 'no',
      waste_spoilage: payload.waste_spoilage || 'no',
      oil_grease_chemicals: payload.oil_grease_chemicals || 'no',
      garbage: payload.garbage || 'no',
      insect_rodent_activity: payload.insect_rodent_activity || 'no',
      bad_odour: payload.bad_odour || 'no',
      observation: payload.observation || '',
      remarks: payload.remarks || '',
      status: 'draft',
      checked_by: currentUserId(),
      verified_by: 0,
      reviewed_by: 0,
      approved_by: 0,
      reviewed_at: '',
      approved_at: '',
      is_locked: false,
      locked_at: '',
      locked_by: 0,
      items,
      audit_logs: [],
      created_at: now(),
      updated_at: now(),
    };
    items.forEach((item: { inspection_id: number }) => {
      item.inspection_id = inspection.id;
    });
    addAuditLog(inspection, 'created', '', 'draft', 'Inspection record created');
    db.inspections.unshift(inspection);
    saveDB();
    return ok(inspection, 'Inspection created successfully');
  }

  if (Number.isNaN(id)) return fail('Invalid inspection id');
  const inspection = db.inspections.find((i) => i.id === id);
  if (!inspection) return fail('Inspection not found');

  switch (sub) {
    case undefined: {
      if (method === 'get') return ok(inspection, 'Inspection fetched successfully');
      if (method === 'put') {
        const payload = asRecord(body);
        const isLocked = payload.is_locked ?? inspection.is_locked;
        if (isLocked) {
          return fail('Inspection is locked. Unlock it before editing.');
        }
        const oldStatus = inspection.status;
        Object.assign(inspection, payload, {
          checked_by: payload.checked_by ?? inspection.checked_by,
          status: payload.status ?? inspection.status,
          updated_at: now(),
        });
        if (Array.isArray(payload.items)) {
          const itemSeed = db.inspections.flatMap((i) => i.items.map((it) => ({ id: it.id })));
          inspection.items = payload.items.map((item: Record<string, any>, index: number) => ({
            id: nextId(itemSeed) + index,
            inspection_id: inspection.id,
            material_name: item.material_name || '',
            lot_number: item.lot_number || '',
            quantity: Number(item.quantity) || 0,
            unit: item.unit || 'kg',
            remark: item.remark || '',
            created_at: now(),
            updated_at: now(),
          }));
        }
        if (oldStatus !== inspection.status) {
          addAuditLog(inspection, 'updated', oldStatus, inspection.status, 'Inspection updated');
        }
        saveDB();
        return ok(inspection, 'Inspection updated successfully');
      }
      if (method === 'delete') {
        db.inspections = db.inspections.filter((i) => i.id !== id);
        saveDB();
        return ok(null, 'Inspection deleted successfully');
      }
      return fail('Method not supported');
    }

    case 'submit': {
      if (method === 'post') {
        if (inspection.status !== 'draft') {
          return fail('Only draft inspections can be submitted for review');
        }
        addAuditLog(inspection, 'submitted', inspection.status, 'submitted', 'Submitted for review');
        inspection.status = 'submitted';
        inspection.updated_at = now();
        saveDB();
        return ok(inspection, 'Inspection submitted for review');
      }
      return fail('Method not supported');
    }

    case 'review': {
      if (method === 'post') {
        const payload = asRecord(body);
        const newStatus = String(payload.status || '');
        const comment = String(payload.comment || '');
        if (!['approved', 'rejected', 'revised'].includes(newStatus)) {
          return fail('Invalid review status');
        }
        if (newStatus === 'approved') {
          inspection.approved_by = currentUserId();
          inspection.approved_at = now();
        }
        inspection.reviewed_by = currentUserId();
        inspection.reviewed_at = now();
        addAuditLog(inspection, 'reviewed', inspection.status, newStatus, comment);
        inspection.status = newStatus as VehicleInspection['status'];
        inspection.updated_at = now();
        saveDB();
        return ok(inspection, `Inspection ${newStatus} successfully`);
      }
      return fail('Method not supported');
    }

    case 'toggle-lock': {
      if (method === 'post') {
        const payload = asRecord(body);
        inspection.is_locked = !!payload.locked;
        inspection.locked_at = inspection.is_locked ? now() : '';
        inspection.locked_by = inspection.is_locked ? currentUserId() : 0;
        addAuditLog(inspection, inspection.is_locked ? 'locked' : 'unlocked', inspection.status, inspection.status, inspection.is_locked ? 'Inspection locked' : 'Inspection unlocked');
        inspection.updated_at = now();
        saveDB();
        return ok(inspection, inspection.is_locked ? 'Inspection locked' : 'Inspection unlocked');
      }
      return fail('Method not supported');
    }

    case 'audit-logs': {
      if (method === 'get') {
        return ok(inspection.audit_logs, 'Audit logs fetched successfully');
      }
      return fail('Method not supported');
    }

    case 'export-pdf': {
      if (method === 'get') {
        const pdf = buildInspectionPdf(inspection);
        return new Blob([pdf], { type: 'application/pdf' });
      }
      return fail('Method not supported');
    }

    default:
      return fail(`Unknown inspection endpoint: ${sub}`);
  }
};

const buildInspectionPdf = (inspection: VehicleInspection): string => {
  const lines = [
    '%PDF-1.4',
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj',
    '4 0 obj<</Length 120>>stream',
    `BT /F1 12 Tf 50 750 Td (Vehicle Inspection Report) Tj ET`,
    `BT /F1 10 Tf 50 730 Td (Inspection #${inspection.id} - ${inspection.inspection_type} - ${inspection.vehicle_no}) Tj ET`,
    `BT /F1 10 Tf 50 715 Td (Date: ${inspection.date} ${inspection.time} - ${inspection.location}) Tj ET`,
    `BT /F1 10 Tf 50 700 Td (Status: ${inspection.status}) Tj ET`,
    `BT /F1 10 Tf 50 685 Td (Observation: ${inspection.observation || 'N/A'}) Tj ET`,
    `BT /F1 10 Tf 50 670 Td (Remarks: ${inspection.remarks || 'N/A'}) Tj ET`,
    'endstream endobj',
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj',
    'trailer<</Root 1 0 R>>',
    '%%EOF',
  ];
  return lines.join('\n');
};

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const mockRequest = async (options: MockRequestOptions): Promise<unknown> => {
  const { method, url, data, params, responseType } = options;
  const methodLower = (method || 'get').toLowerCase();
  const path = String(url || '').replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
  const segments = path.split('/').filter(Boolean);
  const query: Record<string, any> = { ...(params || {}) };

  // Simulate realistic network latency (skip for blob downloads to keep exports snappy)
  if (responseType !== 'blob') {
    await sleep(300);
  }

  if (segments.length === 0) {
    return ok({ service: 'spiceforge-mock-api', status: 'ok' }, 'Mock API is running');
  }

  switch (segments[0]) {
    case 'customers':
      return handleCustomers(methodLower, segments, query, data);
    case 'dispatch-locations':
      return handleDispatchLocations(methodLower, segments, query, data);
    case 'facilities':
      return handleFacilities(methodLower, segments, query, data);
    case 'vehicle-inspections':
      return handleInspections(methodLower, segments, query, data);
    case 'login':
      return handleAuthLogin(methodLower, data);
    case 'logout':
      return ok(null, 'Logged out successfully');
    case 'register':
      return handleAuthRegister(methodLower, data);
    case 'user':
      return handleAuthUser(methodLower);
    default:
      return fail(`Mock endpoint not implemented: /${path}`);
  }
};

// ---------------------------------------------------------------------------
// Auth (used when the app is wired through the axios client in demo mode)
// ---------------------------------------------------------------------------

const handleAuthLogin = async (method: string, data: unknown): Promise<unknown> => {
  if (method !== 'post') return fail('Method not supported');
  const payload = asRecord(data);
  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');
  const user = db.users.find((u) => u.email.toLowerCase() === email);
  if (!user || user.password !== password) {
    return fail('Invalid credentials. Demo login: example@example.com / 123456');
  }
  return ok(
    {
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at, updated_at: user.updated_at },
      token: `demo-token-${user.id}`,
    },
    'Login successful'
  );
};

const handleAuthRegister = async (method: string, data: unknown): Promise<unknown> => {
  if (method !== 'post') return fail('Method not supported');
  const payload = asRecord(data);
  const email = String(payload.email || '').trim().toLowerCase();
  if (!email || !payload.name || !payload.password) {
    return fail('Name, email and password are required');
  }
  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    return fail('An account with this email already exists.');
  }
  const user = {
    id: nextId(db.users),
    name: String(payload.name),
    email,
    password: String(payload.password),
    role: 'viewer',
    created_at: now(),
    updated_at: now(),
  };
  db.users.push(user);
  saveDB();
  return ok(
    {
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at, updated_at: user.updated_at },
      token: `demo-token-${user.id}`,
    },
    'Registration successful'
  );
};

const handleAuthUser = async (method: string): Promise<unknown> => {
  if (method !== 'get') return fail('Method not supported');
  return ok({ user: null }, 'User fetched successfully');
};
