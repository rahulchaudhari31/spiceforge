// src/feature-module/people/customers/CustomerProfile.tsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CommonFooter from "../../../components/footer/commonFooter";
import { useCustomer } from "./hooks/useCustomer";
import DispatchLocations from "./components/DispatchLocations";
import TallyMapping from "./components/TallyMapping";
import DeliveryRequirements from "./components/DeliveryRequirements";

const CustomerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { customer, fetchCustomer, loading } = useCustomer();
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (id) {
      fetchCustomer(parseInt(id));
    }
  }, [id, fetchCustomer]);

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

  if (!customer) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger">Customer not found</div>
          <Link to="/customers" className="btn btn-primary">Back to Customers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Customer Profile</h4>
              <h6>{customer.customer_name} ({customer.customer_code})</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/customers" className="btn btn-secondary me-2">
              <i className="ti ti-arrow-left me-1" /> Back
            </Link>
            <Link to="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit-customer">
              <i className="ti ti-edit me-1" /> Edit
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              <i className="ti ti-user me-1" /> Basic Info
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'dispatch' ? 'active' : ''}`}
              onClick={() => setActiveTab('dispatch')}
            >
              <i className="ti ti-map-pin me-1" /> Dispatch Locations
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'tally' ? 'active' : ''}`}
              onClick={() => setActiveTab('tally')}
            >
              <i className="ti ti-link me-1" /> Tally Mapping
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery')}
            >
              <i className="ti ti-truck-delivery me-1" /> Delivery Req.
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Basic Info Tab */}
          <div className={`tab-pane ${activeTab === 'basic' ? 'show active' : ''}`}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="fw-bold">Customer Code</label>
                      <p>{customer.customer_code}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">Customer Name</label>
                      <p>{customer.customer_name}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">Customer Type</label>
                      <p className="badge bg-info">{customer.customer_type}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">GST Number</label>
                      <p>{customer.gst_number || 'N/A'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">PAN Number</label>
                      <p>{customer.pan_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="fw-bold">Email</label>
                      <p>{customer.email}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">Phone</label>
                      <p>{customer.phone}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">Contact Person</label>
                      <p>{customer.contact_person || 'N/A'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">Address</label>
                      <p>{customer.address || 'N/A'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="fw-bold">Status</label>
                      <span className={`badge ${customer.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Locations Tab */}
          <div className={`tab-pane ${activeTab === 'dispatch' ? 'show active' : ''}`}>
            <DispatchLocations customerId={customer.id} />
          </div>

          {/* Tally Mapping Tab */}
          <div className={`tab-pane ${activeTab === 'tally' ? 'show active' : ''}`}>
            <TallyMapping customerId={customer.id} customer={customer} />
          </div>

          {/* Delivery Requirements Tab */}
          <div className={`tab-pane ${activeTab === 'delivery' ? 'show active' : ''}`}>
            <DeliveryRequirements customerId={customer.id} />
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default CustomerProfile;