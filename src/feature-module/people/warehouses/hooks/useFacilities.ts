// src/feature-module/people/warehouses/hooks/useFacilities.ts
import { useState, useEffect } from 'react';
import { facilityService } from '../../../../core/services/facilityService';
import type { Facility } from '../../../../core/services/facilityService';

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  const createFacility = async (data: Partial<Facility>) => {
    try {
      const newFacility = await facilityService.create(data);
      setFacilities(prev => [...prev, newFacility]);
      return newFacility;
    } catch (err: any) {
      setError(err.message || 'Failed to create facility');
      throw err;
    }
  };

  const updateFacility = async (id: number, data: Partial<Facility>) => {
    try {
      const updated = await facilityService.update(id, data);
      setFacilities(prev => prev.map(f => f.id === id ? updated : f));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update facility');
      throw err;
    }
  };

  const deleteFacility = async (id: number) => {
    try {
      await facilityService.delete(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete facility');
      throw err;
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return {
    facilities,
    loading,
    error,
    fetchFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
  };
};