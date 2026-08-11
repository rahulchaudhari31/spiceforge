// src/feature-module/people/warehouses/index.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CommonFooter from "../../../components/footer/commonFooter";
import PrimeDataTable from "../../../components/data-table";
import TableTopHead from "../../../components/table-top-head";
import SearchFromApi from "../../../components/data-table/search";
import CommonSelect from "../../../components/select/common-select";
import DeleteModal from "../../../components/delete-modal";
import { facilityService } from "../../../core/services/facilityService";
import type { Facility } from "../../../core/json/facility-data";

const FacilityManagement = () => {
  const [listData, setListData] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);

  // Filter states
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Multi-select states
  const [selectedProductionLines, setSelectedProductionLines] = useState<string[]>([]);
  const [selectedLinkedWarehouses, setSelectedLinkedWarehouses] = useState<string[]>([]);

  // Form states for Add/Edit
  const [formData, setFormData] = useState<Partial<Facility>>({
    type: 'warehouse',
    status: 'active'
  });

  // Filter options
  const typeOptions = [
    { label: "All Types", value: "" },
    { label: "Production Facility", value: "production" },
    { label: "Packaging Facility", value: "packaging" },
    { label: "Warehouse", value: "warehouse" },
    { label: "Cold Storage", value: "cold_storage" },
    { label: "Third Party Storage", value: "third_party" },
  ];

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const cityOptions = [
    { label: "Select", value: "" },
    { label: "Los Angeles", value: "los-angeles" },
    { label: "New York City", value: "new-york-city" },
    { label: "Houston", value: "houston" },
    { label: "Chicago", value: "chicago" },
  ];

  const stateOptions = [
    { label: "Select", value: "" },
    { label: "California", value: "california" },
    { label: "New York", value: "new-york" },
    { label: "Texas", value: "texas" },
    { label: "Illinois", value: "illinois" },
  ];

  const countryOptions = [
    { label: "Select", value: "" },
    { label: "United States", value: "united-states" },
    { label: "Canada", value: "canada" },
    { label: "Germany", value: "germany" },
    { label: "India", value: "india" },
  ];

  const warehouseOptions = [
    { label: "Main Warehouse", value: "main-warehouse" },
    { label: "Secondary Warehouse", value: "secondary-warehouse" },
    { label: "Cold Storage A", value: "cold-storage-a" },
  ];

  const productionLineOptions = [
    { label: "Line 1", value: "line-1" },
    { label: "Line 2", value: "line-2" },
    { label: "Line 3", value: "line-3" },
  ];

  // Fetch facilities from API
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await facilityService.getAll();
      if (response.success) {
        setListData(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.facility_code || !formData.name || !formData.type) {
      alert('Please fill in all required fields (Facility Code, Name, and Type)');
      return;
    }

    try {
      const payload = {
        facility_code: formData.facility_code,
        name: formData.name,
        type: formData.type,
        address: formData.address || '',
        contact_person: formData.contact_person || '',
        contact_phone: formData.contact_phone || '',
        contact_email: formData.contact_email || '',
        linked_warehouses: selectedLinkedWarehouses || [],
        production_lines: selectedProductionLines || [],
        tally_godown_code: formData.tally_godown_code || '',
        status: formData.status || 'active',
      };

      const response = await facilityService.create(payload);

      if (response.success) {
        // Close modal
        const modal = document.getElementById('add-facility');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }

        // Reset form
        setFormData({ type: 'warehouse', status: 'active' });
        setSelectedProductionLines([]);
        setSelectedLinkedWarehouses([]);

        // Refresh list
        await fetchFacilities();

        alert('Facility added successfully!');
      } else {
        alert(response.message || 'Failed to add facility');
      }
    } catch (error: any) {
      console.error('Error adding facility:', error);
      alert(error.response?.data?.message || 'An error occurred while adding the facility');
    }
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { class: string; label: string }> = {
      production: { class: 'badge-info', label: 'Production' },
      packaging: { class: 'badge-warning', label: 'Packaging' },
      warehouse: { class: 'badge-success', label: 'Warehouse' },
      cold_storage: { class: 'badge-primary', label: 'Cold Storage' },
      third_party: { class: 'badge-secondary', label: 'Third Party' },
    };
    return types[type] || types.warehouse;
  };

  const columns = [
    {
      header: "Facility Code",
      field: "facility_code",
      key: "facility_code",
      body: (data: Facility) => (
        <span className="fw-bold text-primary">{data.facility_code}</span>
      ),
    },
    {
      header: "Name",
      field: "name",
      key: "name",
      body: (data: Facility) => (
        <div className="d-flex align-items-center">
          <div>
            <p className="mb-0">
              <Link to="#" className="text-default fw-medium">
                {data.name}
              </Link>
            </p>
            <small className="text-muted">{data.type?.replace('_', ' ')}</small>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      field: "type",
      key: "type",
      body: (data: Facility) => {
        const typeInfo = getTypeBadge(data.type);
        return (
          <span className={`badge ${typeInfo.class} d-inline-flex align-items-center badge-xs`}>
            {typeInfo.label}
          </span>
        );
      },
    },
    {
      header: "Contact Person",
      field: "contact_person",
      key: "contact_person",
    },
    {
      header: "Phone",
      field: "contact_phone",
      key: "contact_phone",
    },
    {
      header: "Email",
      field: "contact_email",
      key: "contact_email",
    },
    {
      header: "Linked Warehouses",
      field: "linked_warehouses",
      key: "linked_warehouses",
      body: (data: Facility) => (
        <span>{data.linked_warehouses?.length || 0}</span>
      ),
    },
    {
      header: "Production Lines",
      field: "production_lines",
      key: "production_lines",
      body: (data: Facility) => (
        <span>{data.production_lines?.length || 0}</span>
      ),
    },
    {
      header: "Tally Godown",
      field: "tally_godown_code",
      key: "tally_godown_code",
    },
    {
      header: "Status",
      field: "status",
      key: "status",
      body: (data: Facility) => (
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
      body: (row: Facility) => (
        <div className="edit-delete-action">
          <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#view-facility" onClick={() => setFormData(row)}>
            <i className="feather icon-eye"></i>
          </Link>
          <Link
            className="me-2 p-2"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-facility"
            onClick={() => setFormData(row)}
          >
            <i className="feather icon-edit"></i>
          </Link>
          <Link className="p-2" to="#" data-bs-toggle="modal" data-bs-target="#delete-modal">
            <i className="feather icon-trash-2"></i>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Facilities & Locations</h4>
                <h6>Manage production facilities, warehouses, and storage locations</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-facility"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Facility
              </Link>
            </div>
          </div>

          {/* Facility List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <SearchFromApi
                callback={handleSearch}
                rows={rows}
                setRows={setRows}
              />
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                {/* Type Filter */}
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    {selectedType ? typeOptions.find(t => t.value === selectedType)?.label : 'Type'}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    {typeOptions.map(option => (
                      <li key={option.value}>
                        <Link
                          to="#"
                          className={`dropdown-item rounded-1 ${selectedType === option.value ? 'active' : ''}`}
                          onClick={() => setSelectedType(option.value)}
                        >
                          {option.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Filter */}
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    {selectedStatus ? statusOptions.find(s => s.value === selectedStatus)?.label : 'Status'}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    {statusOptions.map(option => (
                      <li key={option.value}>
                        <Link
                          to="#"
                          className={`dropdown-item rounded-1 ${selectedStatus === option.value ? 'active' : ''}`}
                          onClick={() => setSelectedStatus(option.value)}
                        >
                          {option.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={listData}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalRecords={totalRecords}
                  searchQuery={searchQuery}
                  selectionMode="checkbox"
                  selection={selectedFacilities}
                  onSelectionChange={(e: any) => setSelectedFacilities(e.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>

      {/* ✅ FIXED: Add Facility Modal with onSubmit */}
      <div className="modal fade" id="add-facility">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Facility / Location</h4>
                <h6>Create new production facility, warehouse, or storage location</h6>
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
            <form onSubmit={handleAddFacility}>
              <div className="modal-body">
                <div className="row">
                  {/* Facility Code */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Facility Code <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="facility_code"
                        className="form-control"
                        placeholder="e.g., FAC-001"
                        value={formData.facility_code || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Facility Type */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Facility Type <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={typeOptions.filter(t => t.value !== '')}
                        value={formData.type || ''}
                        onChange={(e) => handleSelectChange('type', e.value)}
                        placeholder="Select Facility Type"
                      />
                    </div>
                  </div>

                  {/* Facility Name */}
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Facility Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter facility name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Contact Person <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="contact_person"
                        className="form-control"
                        placeholder="Enter contact person name"
                        value={formData.contact_person || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Contact Phone <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="contact_phone"
                        className="form-control"
                        placeholder="Enter phone number"
                        value={formData.contact_phone || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        name="contact_email"
                        className="form-control"
                        placeholder="Enter email address"
                        value={formData.contact_email || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Address <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Enter full address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* City, State, Country */}
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">City <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={cityOptions}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        placeholder="Select City"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">State <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={stateOptions}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.value)}
                        placeholder="Select State"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">Country <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.value)}
                        placeholder="Select Country"
                      />
                    </div>
                  </div>

                  {/* Production Lines */}
                  {(formData.type === 'production' || formData.type === 'packaging') && (
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Production Lines</label>
                        <CommonSelect
                          className="w-100"
                          options={productionLineOptions}
                          value={selectedProductionLines}
                          onChange={(e) => setSelectedProductionLines(e.value)}
                          isMulti={true}
                          placeholder="Select production lines"
                        />
                        <small className="text-muted">Select production lines associated with this facility</small>
                      </div>
                    </div>
                  )}

                  {/* Linked Warehouses */}
                  {(formData.type === 'production' || formData.type === 'packaging') && (
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Linked Warehouses</label>
                        <CommonSelect
                          className="w-100"
                          options={warehouseOptions}
                          value={selectedLinkedWarehouses}
                          onChange={(e) => setSelectedLinkedWarehouses(e.value)}
                          isMulti={true}
                          placeholder="Select linked warehouses"
                        />
                        <small className="text-muted">Select warehouses that serve this facility</small>
                      </div>
                    </div>
                  )}

                  {/* Tally Godown */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Tally Godown Code</label>
                      <input
                        type="text"
                        name="tally_godown_code"
                        className="form-control"
                        placeholder="Enter Tally godown code"
                        value={formData.tally_godown_code || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <CommonSelect
                        className="w-100"
                        options={statusOptions.filter(s => s.value !== '')}
                        value={formData.status || 'active'}
                        onChange={(e) => handleSelectChange('status', e.value)}
                        placeholder="Select Status"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Facility</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Facility Modal */}
      <div className="modal fade" id="edit-facility">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Facility / Location</h4>
                <h6>Update facility details</h6>
              </div>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Facility Code <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="facility_code"
                        className="form-control"
                        defaultValue={formData.facility_code || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Facility Type <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={typeOptions.filter(t => t.value !== '')}
                        value={formData.type || ''}
                        onChange={(e) => handleSelectChange('type', e.value)}
                        placeholder="Select Facility Type"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Facility Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        defaultValue={formData.name || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Contact Person <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="contact_person"
                        className="form-control"
                        defaultValue={formData.contact_person || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Contact Phone <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="contact_phone"
                        className="form-control"
                        defaultValue={formData.contact_phone || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        name="contact_email"
                        className="form-control"
                        defaultValue={formData.contact_email || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Address <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        defaultValue={formData.address || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">City <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={cityOptions}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        placeholder="Select City"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">State <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={stateOptions}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.value)}
                        placeholder="Select State"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">Country <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="w-100"
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.value)}
                        placeholder="Select Country"
                      />
                    </div>
                  </div>
                  {(formData.type === 'production' || formData.type === 'packaging') && (
                    <>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Production Lines</label>
                          <CommonSelect
                            className="w-100"
                            options={productionLineOptions}
                            value={selectedProductionLines}
                            onChange={(e) => setSelectedProductionLines(e.value)}
                            isMulti={true}
                            placeholder="Select production lines"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Linked Warehouses</label>
                          <CommonSelect
                            className="w-100"
                            options={warehouseOptions}
                            value={selectedLinkedWarehouses}
                            onChange={(e) => setSelectedLinkedWarehouses(e.value)}
                            isMulti={true}
                            placeholder="Select linked warehouses"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Tally Godown Code</label>
                      <input
                        type="text"
                        name="tally_godown_code"
                        className="form-control"
                        defaultValue={formData.tally_godown_code || ''}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <CommonSelect
                        className="w-100"
                        options={statusOptions.filter(s => s.value !== '')}
                        value={formData.status || 'active'}
                        onChange={(e) => handleSelectChange('status', e.value)}
                        placeholder="Select Status"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View Facility Modal */}
      <div className="modal fade" id="view-facility">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Facility Details</h4>
                <h6>Complete facility information</h6>
              </div>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Facility Code:</strong> {formData.facility_code || 'N/A'}</p>
                  <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
                  <p><strong>Type:</strong> {formData.type || 'N/A'}</p>
                  <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Contact Person:</strong> {formData.contact_person || 'N/A'}</p>
                  <p><strong>Phone:</strong> {formData.contact_phone || 'N/A'}</p>
                  <p><strong>Email:</strong> {formData.contact_email || 'N/A'}</p>
                  <p><strong>Status:</strong> {formData.status || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Tally Godown Code:</strong> {formData.tally_godown_code || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Created At:</strong> {formData.created_at || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal />
    </>
  );
};

export default FacilityManagement;