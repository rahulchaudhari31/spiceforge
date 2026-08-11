// src/feature-module/quality-control/vehicle-inspection/hooks/useInspection.ts

import { useState, useEffect, useCallback } from 'react';
import { inspectionService } from '../../../../core/services/inspectionService';
import type { VehicleInspection, InspectionFilters } from '../types';

export const useInspection = () => {
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [inspection, setInspection] = useState<VehicleInspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch all inspections
  const fetchInspections = useCallback(async (params?: InspectionFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.getAll(params);
      if (response.success) {
        setInspections(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      } else {
        setError(response.message || 'Failed to fetch inspections');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single inspection
  const fetchInspection = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.getById(id);
      if (response.success) {
        setInspection(response.data);
        return response.data;
      } else {
        setError(response.message || 'Inspection not found');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Create inspection
  const createInspection = useCallback(async (data: Partial<VehicleInspection>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.create(data);
      if (response.success) {
        await fetchInspections();
        return response.data;
      } else {
        setError(response.message || 'Failed to create inspection');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchInspections]);

  // Update inspection
  const updateInspection = useCallback(async (id: number, data: Partial<VehicleInspection>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.update(id, data);
      if (response.success) {
        await fetchInspections();
        return response.data;
      } else {
        setError(response.message || 'Failed to update inspection');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchInspections]);

  // Delete inspection
  const deleteInspection = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.delete(id);
      if (response.success) {
        await fetchInspections();
        return true;
      } else {
        setError(response.message || 'Failed to delete inspection');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchInspections]);

  // Submit for review
  const submitInspection = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.submit(id);
      if (response.success) {
        await fetchInspection(id);
        await fetchInspections();
        return response.data;
      } else {
        setError(response.message || 'Failed to submit inspection');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchInspection, fetchInspections]);

  // Review inspection
  const reviewInspection = useCallback(async (id: number, data: { status: string; comment: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.review(id, data);
      if (response.success) {
        await fetchInspection(id);
        await fetchInspections();
        return response.data;
      } else {
        setError(response.message || 'Failed to review inspection');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchInspection, fetchInspections]);

  // Toggle lock
  const toggleLock = useCallback(async (id: number, locked: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectionService.toggleLock(id, { locked });
      if (response.success) {
        await fetchInspection(id);
        await fetchInspections();
        return response.data;
      } else {
        setError(response.message || 'Failed to toggle lock');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchInspection, fetchInspections]);

  // Initial load
  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  return {
    inspections,
    inspection,
    loading,
    error,
    totalRecords,
    fetchInspections,
    fetchInspection,
    createInspection,
    updateInspection,
    deleteInspection,
    submitInspection,
    reviewInspection,
    toggleLock,
  };
};