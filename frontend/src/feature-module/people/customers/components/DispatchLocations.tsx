// src/feature-module/people/customers/components/DispatchLocations.tsx

import { useState, useEffect } from "react";
import { useCustomer } from "../hooks/useCustomer";
import type { DispatchLocation } from "../types";

interface DispatchLocationsProps {
  customerId: number;
}

const DispatchLocations = ({ customerId }: DispatchLocationsProps) => {
  const { customer, addDispatchLocation, updateDispatchLocation, deleteDispatchLocation } = useCustomer();
  const [locations, setLocations] = useState<DispatchLocation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DispatchLocation>>({
    location_code: '',
    location_name: '',
    address: '',
    contact_person: '',
    phone: '',
    is_default: false,
    status: 'active'
  });

  useEffect(() => {
    if (customer?.dispatch_locations) {
      setLocations(customer.dispatch_locations);
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateDispatchLocation(editingId, formData);
    } else {
      await addDispatchLocation(customerId, formData);
    }
    
    setShowForm(false);
    setEditingId(null);
    setFormData({
      location_code: '',
      location_name: '',
      address: '',
      contact_person: '',
      phone: '',
      is_default: false,
      status: 'active'
    });
  };

  const handleEdit = (location: DispatchLocation) => {
    setEditingId(location.id);
    setFormData(location);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dispatch location?')) {
      await deleteDispatchLocation(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      location_code: '',
      location_name: '',
      address: '',
      contact_person: '',
      phone: '',
      is_default: false,
      status: 'active'
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Dispatch Locations</h5>
        <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className="ti ti-plus me-1" /> Add Location
        </button>
      </div>
      <div className="card-body">
        {/* Add/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
            <h6>{editingId ? 'Edit Dispatch Location' : 'Add Dispatch Location'}</h6>
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Location Code *</label>
                  <input
                    type="text"
                    name="location_code"
                    className="form-control"
                    value={formData.location_code || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Location Name *</label>
                  <input
                    type="text"
                    name="location_name"
                    className="form-control"
                    value={formData.location_name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows={2}
                    value={formData.address || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    name="contact_person"
                    className="form-control"
                    value={formData.contact_person || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_default"
                      className="form-check-input"
                      checked={formData.is_default || false}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">Set as Default</label>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status || 'active'}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary me-2">
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Locations List */}
        {locations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No dispatch locations added yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Default</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td><strong>{location.location_code}</strong></td>
                    <td>{location.location_name}</td>
                    <td>{location.address || 'N/A'}</td>
                    <td>{location.contact_person || 'N/A'}</td>
                    <td>
                      {location.is_default ? (
                        <span className="badge badge-success">Default</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            // Set as default
                            setLocations(locations.map(l => ({
                              ...l,
                              is_default: l.id === location.id
                            })));
                          }}
                        >
                          Set Default
                        </button>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${location.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {location.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => handleEdit(location)}
                      >
                        <i className="ti ti-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(location.id)}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchLocations;