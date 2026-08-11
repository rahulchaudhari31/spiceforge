// src/feature-module/people/customers/index.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CommonFooter from "../../../components/footer/commonFooter";
import PrimeDataTable from "../../../components/data-table";
import TableTopHead from "../../../components/table-top-head";
import SearchFromApi from "../../../components/data-table/search";
import DeleteModal from "../../../components/delete-modal";
import { useCustomer } from "./hooks/useCustomer";
import type { Customer } from "./types"; // ✅ Import the type

const Customers = () => {
  const { customers, loading, error, fetchCustomers, deleteCustomer, createCustomer, totalRecords } = useCustomer();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  
  // ✅ FIX: Use Partial<Customer> type
  const [formData, setFormData] = useState<Partial<Customer>>({
    customer_name: '',
    customer_type: 'individual',
    email: '',
    phone: '',
    gst_number: '',
    pan_number: '',
    contact_person: '',
    address: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Reload when search or filters change
  useEffect(() => {
    fetchCustomers({ search: searchQuery, per_page: rows, page: currentPage });
  }, [searchQuery, rows, currentPage]);

  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await createCustomer(formData);
      if (result) {
        // Close modal
        const modal = document.getElementById('add-customer');
        if (modal) {
          // @ts-ignore
          const bsModal = window.bootstrap?.Modal?.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          } else {
            modal.style.display = 'none';
            document.querySelector('.modal-backdrop')?.remove();
          }
        }
        // Reset form
        setFormData({
          customer_name: '',
          customer_type: 'individual',
          email: '',
          phone: '',
          gst_number: '',
          pan_number: '',
          contact_person: '',
          address: '',
          status: 'active'
        });
        // Refresh list
        await fetchCustomers();
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Customer Code",
      field: "customer_code",
      key: "customer_code",
      body: (data: any) => (
        <span className="fw-bold">{data.customer_code}</span>
      ),
    },
    {
      header: "Customer",
      field: "customer_name",
      key: "customer_name",
      body: (data: any) => (
        <Link to={`/customer-profile/${data.id}`} className="text-default fw-medium">
          {data.customer_name}
        </Link>
      ),
    },
    {
      header: "Email",
      field: "email",
      key: "email",
    },
    {
      header: "Phone",
      field: "phone",
      key: "phone",
    },
    {
      header: "Country",
      field: "address",
      key: "address",
      body: (data: any) => {
        if (!data.address) return 'N/A';
        const parts = data.address.split(',');
        return parts[parts.length - 1]?.trim() || 'N/A';
      },
    },
    {
      header: "Status",
      field: "status",
      key: "status",
      body: (data: any) => (
        <span className={`badge ${data.status === 'active' ? 'badge-success' : 'badge-danger'} d-inline-flex align-items-center badge-xs`}>
          <i className="ti ti-point-filled me-1"></i>
          {data.status}
        </span>
      ),
    },
    {
      header: "",
      field: "actions",
      key: "actions",
      sortable: false,
      body: (row: any) => (
        <div className="edit-delete-action">
          <Link className="me-2 p-2" to={`/customer-profile/${row.id}`}>
            <i className="feather icon-eye"></i>
          </Link>
          <Link
            className="me-2 p-2"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-customer"
          >
            <i className="feather icon-edit"></i>
          </Link>
          <Link
            className="p-2"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
            onClick={() => handleDelete(row.id)}
          >
            <i className="feather icon-trash-2"></i>
          </Link>
        </div>
      ),
    },
  ];

  if (loading && customers.length === 0) {
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

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger">
            <h5>Error Loading Customers</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchCustomers()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Customers</h4>
                <h6>Manage your customers</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-customer"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Customer
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <SearchFromApi
                callback={handleSearch}
                rows={rows}
                setRows={setRows}
              />
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={customers}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalRecords={totalRecords}
                  searchQuery={searchQuery}
                  selectionMode="checkbox"
                  selection={selectedCustomers}
                  onSelectionChange={(e: any) => setSelectedCustomers(e.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>

      {/* ✅ Add Customer Modal */}
      <div className="modal fade" id="add-customer" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Customer</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  {/* Customer Name */}
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Customer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      className="form-control"
                      placeholder="Enter customer name"
                      value={formData.customer_name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Customer Type */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      Customer Type <span className="text-danger">*</span>
                    </label>
                    <select
                      name="customer_type"
                      className="form-select"
                      value={formData.customer_type || 'individual'}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="retailer">Retailer</option>
                      <option value="wholesaler">Wholesaler</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-lg-6 mb-3">
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

                  {/* Email */}
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* GST Number */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">GST Number</label>
                    <input
                      type="text"
                      name="gst_number"
                      className="form-control"
                      placeholder="Enter GST number"
                      value={formData.gst_number || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* PAN Number */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">PAN Number</label>
                    <input
                      type="text"
                      name="pan_number"
                      className="form-control"
                      placeholder="Enter PAN number"
                      value={formData.pan_number || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      name="contact_person"
                      className="form-control"
                      placeholder="Enter contact person"
                      value={formData.contact_person || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows={2}
                      placeholder="Enter full address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Customer Modal - Placeholder */}
      <div className="modal fade" id="edit-customer" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Customer</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center py-4">
                <p>Edit functionality coming soon...</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal />
    </>
  );
};

export default Customers;