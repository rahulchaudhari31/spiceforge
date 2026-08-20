// src/feature-module/quality-control/vehicle-inspection/components/InspectionReview.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommonFooter from "../../../../components/footer/commonFooter";
import { useInspection } from "../hooks/useInspection";

const InspectionReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inspection, fetchInspection, reviewInspection, loading } = useInspection();
  const [reviewComment, setReviewComment] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    if (id) {
      fetchInspection(parseInt(id));
    }
  }, [id, fetchInspection]);

  const handleReview = async (status: string) => {
    if (!reviewComment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    const result = await reviewInspection(parseInt(id!), { status, comment: reviewComment });
    if (result) {
      alert(`Inspection ${status === 'approved' ? 'Approved' : 'Rejected'} successfully`);
      navigate('/quality-control/vehicle-inspections');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger">Inspection not found</div>
          <Link to="/quality-control/vehicle-inspections" className="btn btn-primary">Back to List</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Review Inspection</h4>
              <h6>Inspection #{inspection.id}</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/quality-control/vehicle-inspections" className="btn btn-secondary">
              <i className="ti ti-arrow-left me-1" /> Back
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {/* Inspection Details (Read-only) */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="fw-bold">Inspection Type</label>
                <p>{inspection.inspection_type?.toUpperCase()}</p>
              </div>
              <div className="col-md-4">
                <label className="fw-bold">Vehicle No.</label>
                <p>{inspection.vehicle_no}</p>
              </div>
              <div className="col-md-4">
                <label className="fw-bold">Date & Time</label>
                <p>{inspection.date} {inspection.time}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label className="fw-bold">Location</label>
                <p>{inspection.location}</p>
              </div>
            </div>

            {/* Inspection Parameters */}
            <h6 className="border-bottom pb-2 mb-3">Inspection Parameters</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Vehicle Condition:</strong> {inspection.vehicle_condition}</p>
                <p><strong>Insects:</strong> {inspection.insects}</p>
                <p><strong>Undesirable Odour:</strong> {inspection.undesirable_odour}</p>
                <p><strong>Nail/Bolt Projection:</strong> {inspection.nail_bolt_projection}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Covered from Top:</strong> {inspection.covered_from_top}</p>
                <p><strong>Camera Check:</strong> {inspection.camera_check}</p>
                <p><strong>Proper Holding by Rope:</strong> {inspection.proper_holding_rope}</p>
              </div>
            </div>

            {/* Additional Details */}
            <h6 className="border-bottom pb-2 mb-3">Additional Inspection Details</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Vehicle Floorboard:</strong> {inspection.floorboard_ok}</p>
                <p><strong>Waste / Spoilage Food:</strong> {inspection.waste_spoilage}</p>
                <p><strong>Oil/Grease/Chemicals:</strong> {inspection.oil_grease_chemicals}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Garbage:</strong> {inspection.garbage}</p>
                <p><strong>Insect/Rodent Activity:</strong> {inspection.insect_rodent_activity}</p>
                <p><strong>Bad Odour:</strong> {inspection.bad_odour}</p>
              </div>
            </div>

            {/* Materials */}
            <h6 className="border-bottom pb-2 mb-3">Materials</h6>
            <div className="table-responsive mb-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Material Name</th>
                    <th>Lot Number</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {inspection.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.material_name}</td>
                      <td>{item.lot_number}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{item.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Observation & Remarks */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="fw-bold">Observation</label>
                <p>{inspection.observation || 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold">Remarks</label>
                <p>{inspection.remarks || 'N/A'}</p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="fw-bold me-2">Status:</label>
              <span className="badge bg-primary">{inspection.status}</span>
            </div>

            {/* Review Section */}
            <hr />
            <h6 className="mb-3">Review</h6>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Review Comment <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Enter your review comments..."
                />
              </div>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-success" 
                onClick={() => handleReview('approved')}
                disabled={loading}
              >
                <i className="ti ti-check me-1" /> Approve
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleReview('rejected')}
                disabled={loading}
              >
                <i className="ti ti-x me-1" /> Reject
              </button>
              <button 
                className="btn btn-warning" 
                onClick={() => handleReview('revised')}
                disabled={loading}
              >
                <i className="ti ti-rotate me-1" /> Request Revision
              </button>
              <Link to="/quality-control/vehicle-inspections" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default InspectionReview;