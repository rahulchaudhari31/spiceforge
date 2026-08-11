// src/feature-module/quality-control/vehicle-inspection/index.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CommonFooter from "../../../components/footer/commonFooter";
import PrimeDataTable from "../../../components/data-table";
import TableTopHead from "../../../components/table-top-head";
import SearchFromApi from "../../../components/data-table/search";
import DeleteModal from "../../../components/delete-modal";
import { useInspection } from "./hooks/useInspection";
import type { VehicleInspection } from "./types";

const VehicleInspections = () => {
  const { inspections, loading, error, fetchInspections, deleteInspection, totalRecords } = useInspection();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedInspections, setSelectedInspections] = useState<VehicleInspection[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  useEffect(() => {
    fetchInspections({ 
      search: searchQuery, 
      per_page: rows, 
      page: currentPage,
      status: statusFilter,
      inspection_type: typeFilter
    });
  }, [searchQuery, rows, currentPage, statusFilter, typeFilter, fetchInspections]);

  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this inspection?')) {
      await deleteInspection(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      draft: { class: 'badge-warning', label: 'Draft' },
      submitted: { class: 'badge-info', label: 'Submitted' },
      under_review: { class: 'badge-primary', label: 'Under Review' },
      approved: { class: 'badge-success', label: 'Approved' },
      rejected: { class: 'badge-danger', label: 'Rejected' },
      revised: { class: 'badge-warning', label: 'Revised' }
    };
    return statusMap[status] || { class: 'badge-secondary', label: status };
  };

  const columns = [
    {
      header: "Inspection ID",
      field: "id",
      key: "id",
      body: (data: VehicleInspection) => (
        <span className="fw-bold text-primary">#INSP-{String(data.id).padStart(4, '0')}</span>
      ),
    },
    {
      header: "Vehicle No.",
      field: "vehicle_no",
      key: "vehicle_no",
      body: (data: VehicleInspection) => (
        <span className="fw-medium">{data.vehicle_no}</span>
      ),
    },
    {
      header: "Type",
      field: "inspection_type",
      key: "inspection_type",
      body: (data: VehicleInspection) => (
        <span className={`badge ${data.inspection_type === 'loading' ? 'badge-info' : 'badge-secondary'}`}>
          {data.inspection_type?.toUpperCase()}
        </span>
      ),
    },
    {
      header: "Location",
      field: "location",
      key: "location",
    },
    {
      header: "Date",
      field: "date",
      key: "date",
      body: (data: VehicleInspection) => (
        <span>{new Date(data.date).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Status",
      field: "status",
      key: "status",
      body: (data: VehicleInspection) => {
        const status = getStatusBadge(data.status);
        return (
          <span className={`badge ${status.class} d-inline-flex align-items-center badge-xs`}>
            <i className="ti ti-point-filled me-1"></i>
            {status.label}
          </span>
        );
      },
    },
    {
      header: "Locked",
      field: "is_locked",
      key: "is_locked",
      body: (data: VehicleInspection) => (
        data.is_locked ? (
          <span className="badge badge-danger">
            <i className="ti ti-lock me-1"></i> Locked
          </span>
        ) : (
          <span className="badge badge-success">
            <i className="ti ti-lock-open me-1"></i> Unlocked
          </span>
        )
      ),
    },
    {
      header: "",
      field: "actions",
      key: "actions",
      sortable: false,
      body: (row: VehicleInspection) => (
        <div className="edit-delete-action d-flex align-items-center">
          <Link className="me-2 p-2 d-flex align-items-center border rounded" to={`/quality-control/vehicle-inspections/${row.id}`}>
            <i className="feather icon-eye"></i>
          </Link>
          {row.status === 'draft' || row.status === 'revised' ? (
            <Link className="me-2 p-2 d-flex align-items-center border rounded" to={`/quality-control/vehicle-inspections/edit/${row.id}`}>
              <i className="feather icon-edit"></i>
            </Link>
          ) : (
            <Link className="me-2 p-2 d-flex align-items-center border rounded" to={`/quality-control/vehicle-inspections/review/${row.id}`}>
              <i className="feather icon-check-square"></i>
            </Link>
          )}
          <Link className="p-2 d-flex align-items-center border rounded" to="#" data-bs-toggle="modal" data-bs-target="#delete-modal" onClick={() => handleDelete(row.id)}>
            <i className="feather icon-trash-2"></i>
          </Link>
        </div>
      ),
    },
  ];

  if (loading && inspections.length === 0) {
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
            <h5>Error Loading Inspections</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchInspections()}>
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
                <h4>Vehicle Inspections</h4>
                <h6>Manage vehicle inspection records</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="/quality-control/vehicle-inspections/create"
                className="btn btn-primary text-white"
              >
                <i className="ti ti-circle-plus me-1" />
                New Inspection
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
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                {/* Status Filter */}
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    {statusFilter ? statusFilter.replace('_', ' ').toUpperCase() : 'Status'}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setStatusFilter("")}>All</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setStatusFilter("draft")}>Draft</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setStatusFilter("submitted")}>Submitted</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setStatusFilter("under_review")}>Under Review</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setStatusFilter("approved")}>Approved</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setStatusFilter("rejected")}>Rejected</Link></li>
                  </ul>
                </div>

                {/* Type Filter */}
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    {typeFilter ? typeFilter.toUpperCase() : 'Type'}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setTypeFilter("")}>All</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setTypeFilter("loading")}>Loading</Link></li>
                    <li><Link to="#" className="dropdown-item rounded-1" onClick={() => setTypeFilter("unloading")}>Unloading</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={inspections}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalRecords={totalRecords}
                  searchQuery={searchQuery}
                  selectionMode="checkbox"
                  selection={selectedInspections}
                  onSelectionChange={(e: any) => setSelectedInspections(e.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
      <DeleteModal />
    </>
  );
};

export default VehicleInspections;