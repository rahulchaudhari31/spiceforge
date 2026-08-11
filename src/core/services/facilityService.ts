// src/core/services/facilityService.ts
import api from '../api/axios';

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

export const facilityService = {
  // Get all facilities
  getAll: async () => {
    const response = await api.get('/facilities');
    return response.data;
  },

  // Get facility by ID
  getById: async (id: number) => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },

  // Create new facility
  create: async (data: Partial<Facility>) => {
    const response = await api.post('/facilities', data);
    return response.data;
  },

  // Update facility
  update: async (id: number, data: Partial<Facility>) => {
    const response = await api.put(`/facilities/${id}`, data);
    return response.data;
  },

  // Delete facility
  delete: async (id: number) => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  },

  // Get production lines for a facility
  getProductionLines: async (facilityId: number) => {
    const response = await api.get(`/facilities/${facilityId}/production-lines`);
    return response.data;
  },

  // Get tally godown mappings
  getTallyGodowns: async (facilityId: number) => {
    const response = await api.get(`/facilities/${facilityId}/tally-godowns`);
    return response.data;
  },

  // Link warehouse to facility
  linkWarehouse: async (facilityId: number, warehouseId: number) => {
    const response = await api.post(`/facilities/${facilityId}/link-warehouse`, { warehouse_id: warehouseId });
    return response.data;
  },

  // Unlink warehouse from facility
  unlinkWarehouse: async (facilityId: number, warehouseId: number) => {
    const response = await api.delete(`/facilities/${facilityId}/unlink-warehouse/${warehouseId}`);
    return response.data;
  }
};