// src/feature-module/quality-control/vehicle-inspection/components/InspectionForm.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import CommonFooter from "../../../../components/footer/commonFooter";
import { useInspection } from "../hooks/useInspection";
import type { VehicleInspection } from "../types";


interface FormItem {
  material_name: string;
  lot_number: string;
  quantity: number;
  unit: string;
  remark: string;
}

const InspectionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inspection, createInspection, updateInspection, submitInspection, toggleLock, loading } = useInspection();
  const [items, setItems] = useState<FormItem[]>([
    { material_name: '', lot_number: '', quantity: 0, unit: '', remark: '' }
  ]);

  const [formData, setFormData] = useState<Partial<VehicleInspection>>({
    inspection_type: 'loading',
    location: '',
    vehicle_no: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    vehicle_condition: 'na',
    insects: 'na',
    undesirable_odour: 'na',
    nail_bolt_projection: 'na',
    covered_from_top: 'na',
    camera_check: 'na',
    proper_holding_rope: 'na',
    floorboard_ok: 'na',
    waste_spoilage: 'na',
    oil_grease_chemicals: 'na',
    garbage: 'na',
    insect_rodent_activity: 'na',
    bad_odour: 'na',
    observation: '',
    remarks: '',
    status: 'draft',
    is_locked: false
  });

  const [isLocked, setIsLocked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      // Fetch inspection data
      // setFormData(inspection);
      // setIsLocked(inspection?.is_locked || false);
    }
  }, [id]);

  const canEdit = () => {
    if (isLocked) return false;
    if (formData.status === 'submitted' || formData.status === 'under_review' || formData.status === 'approved') return false;
    return true;
  };

  const canSubmit = () => {
    return !isLocked && (formData.status === 'draft' || formData.status === 'revised');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems(prev => [...prev, { material_name: '', lot_number: '', quantity: 0, unit: '', remark: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (status: VehicleInspection['status']) => {
    if (isLocked) {
      alert('This form is locked and cannot be modified.');
      return;
    }

    const payload: Partial<VehicleInspection> = {
      ...formData,
      status: status,
      items: items as any // Cast to any since backend expects array
    };
    
    try {
      let result;
      if (isEditMode && id) {
        result = await updateInspection(parseInt(id), payload);
      } else {
        result = await createInspection(payload);
      }
      
      if (result) {
        alert(status === 'draft' ? 'Saved as draft successfully!' : 'Submitted for review successfully!');
        navigate('/quality-control/vehicle-inspections');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form');
    }
  };

  const handleLockToggle = async () => {
    if (!id) return;
    const newLockState = !isLocked;
    const result = await toggleLock(parseInt(id), newLockState);
    if (result) {
      setIsLocked(newLockState);
      alert(`Form ${newLockState ? 'locked' : 'unlocked'} successfully`);
    }
  };

  const renderInspectionField = (label: string, field: keyof VehicleInspection, options: string[]) => (
    <div className="row align-items-center mb-2">
      <div className="col-md-6">
        <label className="form-label fw-medium">{label}</label>
      </div>
      <div className="col-md-6">
        <select
          className="form-select"
          name={field}
          value={formData[field] as string || 'na'}
          onChange={handleInputChange}
          disabled={!canEdit()}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>{isEditMode ? 'Edit' : 'New'} Vehicle Inspection</h4>
              <h6>Fill in the inspection details</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/quality-control/vehicle-inspections" className="btn btn-secondary me-2">
              <i className="ti ti-arrow-left me-1" /> Back
            </Link>
            {isEditMode && (
              <button className="btn btn-warning" onClick={handleLockToggle} disabled={loading}>
                <i className={`ti ti-${isLocked ? 'lock-open' : 'lock'} me-1`} />
                {isLocked ? 'Unlock' : 'Lock'}
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form>
              {/* Header Fields */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Inspection Type <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    name="inspection_type"
                    value={formData.inspection_type}
                    onChange={handleInputChange}
                    disabled={!canEdit()}
                  >
                    <option value="loading">Loading</option>
                    <option value="unloading">Unloading</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Location <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!canEdit()}
                    placeholder="Enter location"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Vehicle No. <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="vehicle_no"
                    value={formData.vehicle_no}
                    onChange={handleInputChange}
                    disabled={!canEdit()}
                    placeholder="Enter vehicle number"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Date & Time <span className="text-danger">*</span></label>
                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      disabled={!canEdit()}
                    />
                    <input
                      type="time"
                      className="form-control"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </div>
              </div>

              {/* Inspection Parameters */}
              <div className="card mb-3">
                <div className="card-header">
                  <h6 className="mb-0">Inspection Parameters</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      {renderInspectionField('Vehicle Condition (Clean/Unclean)', 'vehicle_condition', ['na', 'clean', 'unclean'])}
                      {renderInspectionField('Insects (Yes/No)', 'insects', ['na', 'yes', 'no'])}
                      {renderInspectionField('Undesirable Odour (Yes/No)', 'undesirable_odour', ['na', 'yes', 'no'])}
                      {renderInspectionField('Nail/Bolt Projection (Yes/No)', 'nail_bolt_projection', ['na', 'yes', 'no'])}
                    </div>
                    <div className="col-md-6">
                      {renderInspectionField('Covered from Top (Yes/No)', 'covered_from_top', ['na', 'yes', 'no'])}
                      {renderInspectionField('Camera Check (Yes/No)', 'camera_check', ['na', 'yes', 'no'])}
                      {renderInspectionField('Proper Holding by Rope (Yes/No)', 'proper_holding_rope', ['na', 'yes', 'no'])}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Inspection Details */}
              <div className="card mb-3">
                <div className="card-header">
                  <h6 className="mb-0">Additional Inspection Details</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      {renderInspectionField('Vehicle Floorboard (Yes/No)', 'floorboard_ok', ['na', 'yes', 'no'])}
                      {renderInspectionField('Waste / Spoilage Food (Yes/No)', 'waste_spoilage', ['na', 'yes', 'no'])}
                      {renderInspectionField('Oil / Grease / Chemicals (Yes/No)', 'oil_grease_chemicals', ['na', 'yes', 'no'])}
                    </div>
                    <div className="col-md-6">
                      {renderInspectionField('Garbage (Yes/No)', 'garbage', ['na', 'yes', 'no'])}
                      {renderInspectionField('Insect / Rodent Activity (Yes/No)', 'insect_rodent_activity', ['na', 'yes', 'no'])}
                      {renderInspectionField('Bad Odour (Yes/No)', 'bad_odour', ['na', 'yes', 'no'])}
                    </div>
                  </div>
                </div>
              </div>

              {/* Material Items */}
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Material Details</h6>
                  {canEdit() && (
                    <button type="button" className="btn btn-sm btn-primary" onClick={addItem}>
                      <i className="ti ti-plus me-1" /> Add Item
                    </button>
                  )}
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Material Name</th>
                          <th>Lot Number</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Remark</th>
                          {canEdit() && <th style={{ width: '50px' }}>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.material_name}
                                onChange={(e) => handleItemChange(index, 'material_name', e.target.value)}
                                disabled={!canEdit()}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.lot_number}
                                onChange={(e) => handleItemChange(index, 'lot_number', e.target.value)}
                                disabled={!canEdit()}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                disabled={!canEdit()}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.unit}
                                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                disabled={!canEdit()}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.remark}
                                onChange={(e) => handleItemChange(index, 'remark', e.target.value)}
                                disabled={!canEdit()}
                              />
                            </td>
                            {canEdit() && (
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeItem(index)}
                                  disabled={items.length <= 1}
                                >
                                  <i className="ti ti-trash" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Observation & Remarks */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Observation</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="observation"
                    value={formData.observation}
                    onChange={handleInputChange}
                    disabled={!canEdit()}
                    placeholder="Enter any observations..."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    disabled={!canEdit()}
                    placeholder="Enter any remarks..."
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <label className="fw-medium me-2">Status:</label>
                <span className={`badge ${formData.status === 'draft' ? 'badge-warning' : 
                  formData.status === 'submitted' ? 'badge-info' : 
                  formData.status === 'under_review' ? 'badge-primary' : 
                  formData.status === 'approved' ? 'badge-success' : 
                  formData.status === 'rejected' ? 'badge-danger' : 'badge-secondary'}`}>
                  {formData.status?.replace('_', ' ').toUpperCase()}
                </span>
                {isLocked && (
                  <span className="badge badge-danger ms-2">
                    <i className="ti ti-lock me-1" /> LOCKED
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                {canEdit() && (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={loading}>
                      <i className="ti ti-file me-1" /> Save as Draft
                    </button>
                    {canSubmit() && (
                      <button type="button" className="btn btn-primary" onClick={() => handleSave('submitted')} disabled={loading}>
                        <i className="ti ti-send me-1" /> Submit for Review
                      </button>
                    )}
                  </>
                )}
                {!canEdit() && formData.status === 'under_review' && id && (
                  <Link to={`/quality-control/vehicle-inspections/review/${id}`} className="btn btn-primary">
                    <i className="ti ti-eye me-1" /> Review
                  </Link>
                )}
                <Link to="/quality-control/vehicle-inspections" className="btn btn-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default InspectionForm;