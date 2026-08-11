// src/core/services/inspectionService.ts

import api from '../api/axios';
import type { VehicleInspection, InspectionItem, InspectionFilters } from '../../feature-module/quality-control/vehicle-inspection/types';

export const inspectionService = {
  // Get all inspections
  getAll: async (params?: InspectionFilters) => {
    const response = await api.get('/vehicle-inspections', { params });
    return response.data;
  },

  // Get single inspection
  getById: async (id: number) => {
    const response = await api.get(`/vehicle-inspections/${id}`);
    return response.data;
  },

  // Create new inspection
  create: async (data: Partial<VehicleInspection>) => {
    const response = await api.post('/vehicle-inspections', data);
    return response.data;
  },

  // Update inspection
  update: async (id: number, data: Partial<VehicleInspection>) => {
    const response = await api.put(`/vehicle-inspections/${id}`, data);
    return response.data;
  },

  // Delete inspection
  delete: async (id: number) => {
    const response = await api.delete(`/vehicle-inspections/${id}`);
    return response.data;
  },

  // Submit for review
  submit: async (id: number) => {
    const response = await api.post(`/vehicle-inspections/${id}/submit`);
    return response.data;
  },

  // Review (Approve/Reject)
  review: async (id: number, data: { status: string; comment: string }) => {
    const response = await api.post(`/vehicle-inspections/${id}/review`, data);
    return response.data;
  },

  // Lock/Unlock inspection
  toggleLock: async (id: number, data: { locked: boolean }) => {
    const response = await api.post(`/vehicle-inspections/${id}/toggle-lock`, data);
    return response.data;
  },

  // Get audit logs
  getAuditLogs: async (id: number) => {
    const response = await api.get(`/vehicle-inspections/${id}/audit-logs`);
    return response.data;
  },

  // Export to PDF
  exportPDF: async (id: number) => {
    const response = await api.get(`/vehicle-inspections/${id}/export-pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};