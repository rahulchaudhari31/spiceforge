// src/feature-module/people/customers/components/DeliveryRequirements.tsx

import { useState, useEffect } from "react";
import { useCustomer } from "../hooks/useCustomer";
import type { DeliveryRequirement } from "../types";

interface DeliveryRequirementsProps {
  customerId: number;
}

const DeliveryRequirements = ({ customerId }: DeliveryRequirementsProps) => {
  const { customer, updateDeliveryRequirements } = useCustomer();
  const [formData, setFormData] = useState<Partial<DeliveryRequirement>>({
    delivery_type: 'standard',
    time_slot: '',
    special_instructions: '',
    preferred_carrier: '',
    delivery_zone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer?.delivery_requirements) {
      setFormData(customer.delivery_requirements);
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateDeliveryRequirements(customerId, formData);
      alert('Delivery requirements saved successfully!');
    } catch (error) {
      alert('Failed to save delivery requirements');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Delivery Requirements</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Delivery Type *</label>
                <select
                  name="delivery_type"
                  className="form-select"
                  value={formData.delivery_type || 'standard'}
                  onChange={handleInputChange}
                  required
                >
                  <option value="express">Express</option>
                  <option value="standard">Standard</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Time Slot</label>
                <input
                  type="text"
                  name="time_slot"
                  className="form-control"
                  value={formData.time_slot || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Preferred Carrier</label>
                <input
                  type="text"
                  name="preferred_carrier"
                  className="form-control"
                  value={formData.preferred_carrier || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., DHL, FedEx, UPS"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Delivery Zone</label>
                <input
                  type="text"
                  name="delivery_zone"
                  className="form-control"
                  value={formData.delivery_zone || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Zone A, North Region"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label">Special Instructions</label>
                <textarea
                  name="special_instructions"
                  className="form-control"
                  rows={3}
                  value={formData.special_instructions || ''}
                  onChange={handleInputChange}
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Delivery Requirements'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-light rounded">
          <h6>Delivery Types:</h6>
          <ul className="mb-0">
            <li><strong>Express:</strong> Same-day or next-day delivery</li>
            <li><strong>Standard:</strong> Regular delivery (2-5 business days)</li>
            <li><strong>Scheduled:</strong> Customer-specified delivery date/time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequirements;