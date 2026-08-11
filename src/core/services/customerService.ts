// src/core/services/customerService.ts

import api from '../api/axios';
import type { Customer, DispatchLocation, DeliveryRequirement } from '../../feature-module/people/customers/types';

export const customerService = {
  // ============ CUSTOMERS ============
  
  // Get all customers
  getAll: async (params?: any) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  // Get customer by ID with all relations
  getById: async (id: number) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  create: async (data: Partial<Customer>) => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  // Update customer
  update: async (id: number, data: Partial<Customer>) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  // Delete customer
  delete: async (id: number) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // ============ DISPATCH LOCATIONS ============
  
  // Get dispatch locations for a customer
  getDispatchLocations: async (customerId: number) => {
    const response = await api.get(`/customers/${customerId}/dispatch-locations`);
    return response.data;
  },

  // Add dispatch location
  addDispatchLocation: async (customerId: number, data: Partial<DispatchLocation>) => {
    const response = await api.post(`/customers/${customerId}/dispatch-locations`, data);
    return response.data;
  },

  // Update dispatch location
  updateDispatchLocation: async (locationId: number, data: Partial<DispatchLocation>) => {
    const response = await api.put(`/dispatch-locations/${locationId}`, data);
    return response.data;
  },

  // Delete dispatch location
  deleteDispatchLocation: async (locationId: number) => {
    const response = await api.delete(`/dispatch-locations/${locationId}`);
    return response.data;
  },

  // Set default dispatch location
  setDefaultDispatchLocation: async (customerId: number, locationId: number) => {
    const response = await api.put(`/customers/${customerId}/dispatch-locations/${locationId}/default`);
    return response.data;
  },

  // ============ TALLY LEDGER MAPPING ============
  
  // Get Tally mapping for a customer
  getTallyMapping: async (customerId: number) => {
    const response = await api.get(`/customers/${customerId}/tally-mapping`);
    return response.data;
  },

  // Update Tally mapping
  updateTallyMapping: async (customerId: number, data: { tally_ledger_code: string; tally_ledger_name: string }) => {
    const response = await api.put(`/customers/${customerId}/tally-mapping`, data);
    return response.data;
  },

  // Validate Tally mapping before XML export
  validateTallyMapping: async (customerId: number) => {
    const response = await api.post(`/customers/${customerId}/validate-tally`);
    return response.data;
  },

  // Export to XML
  exportToXML: async (customerId: number) => {
    const response = await api.get(`/customers/${customerId}/export-xml`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ============ DELIVERY REQUIREMENTS ============
  
  // Get delivery requirements for a customer
  getDeliveryRequirements: async (customerId: number) => {
    const response = await api.get(`/customers/${customerId}/delivery-requirements`);
    return response.data;
  },

  // Update delivery requirements
  updateDeliveryRequirements: async (customerId: number, data: Partial<DeliveryRequirement>) => {
    const response = await api.put(`/customers/${customerId}/delivery-requirements`, data);
    return response.data;
  },
};