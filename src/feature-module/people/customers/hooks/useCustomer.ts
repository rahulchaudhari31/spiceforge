// src/feature-module/people/customers/hooks/useCustomer.ts

import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../../../../core/services/customerService';
import type { Customer, DispatchLocation, DeliveryRequirement } from '../types';

export const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch all customers
  const fetchCustomers = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getAll(params);
      if (response.success) {
        setCustomers(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      } else {
        setError(response.message || 'Failed to fetch customers');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single customer with relations
  const fetchCustomer = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getById(id);
      if (response.success) {
        setCustomer(response.data);
        return response.data;
      } else {
        setError(response.message || 'Customer not found');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Create customer
  const createCustomer = useCallback(async (data: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.create(data);
      if (response.success) {
        await fetchCustomers();
        return response.data;
      } else {
        setError(response.message || 'Failed to create customer');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  // Update customer
  const updateCustomer = useCallback(async (id: number, data: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.update(id, data);
      if (response.success) {
        await fetchCustomers();
        return response.data;
      } else {
        setError(response.message || 'Failed to update customer');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  // Delete customer
  const deleteCustomer = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.delete(id);
      if (response.success) {
        await fetchCustomers();
        return true;
      } else {
        setError(response.message || 'Failed to delete customer');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  // Dispatch Locations
  const addDispatchLocation = useCallback(async (customerId: number, data: Partial<DispatchLocation>) => {
    try {
      const response = await customerService.addDispatchLocation(customerId, data);
      if (response.success) {
        await fetchCustomer(customerId);
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [fetchCustomer]);

  const updateDispatchLocation = useCallback(async (locationId: number, data: Partial<DispatchLocation>) => {
    try {
      const response = await customerService.updateDispatchLocation(locationId, data);
      if (response.success) {
        if (customer) await fetchCustomer(customer.id);
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [customer, fetchCustomer]);

  const deleteDispatchLocation = useCallback(async (locationId: number) => {
    try {
      const response = await customerService.deleteDispatchLocation(locationId);
      if (response.success) {
        if (customer) await fetchCustomer(customer.id);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [customer, fetchCustomer]);

  // Tally Mapping
  const updateTallyMapping = useCallback(async (customerId: number, data: { tally_ledger_code: string; tally_ledger_name: string }) => {
    try {
      const response = await customerService.updateTallyMapping(customerId, data);
      if (response.success) {
        await fetchCustomer(customerId);
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [fetchCustomer]);

  const validateTally = useCallback(async (customerId: number) => {
    try {
      const response = await customerService.validateTallyMapping(customerId);
      return response;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const exportToXML = useCallback(async (customerId: number) => {
    try {
      const blob = await customerService.exportToXML(customerId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer_${customerId}_export.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  // Delivery Requirements
  const updateDeliveryRequirements = useCallback(async (customerId: number, data: Partial<DeliveryRequirement>) => {
    try {
      const response = await customerService.updateDeliveryRequirements(customerId, data);
      if (response.success) {
        await fetchCustomer(customerId);
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [fetchCustomer]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    customer,
    loading,
    error,
    totalRecords,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addDispatchLocation,
    updateDispatchLocation,
    deleteDispatchLocation,
    updateTallyMapping,
    validateTally,
    exportToXML,
    updateDeliveryRequirements,
  };
};