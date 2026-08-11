// src/feature-module/quality-control/vehicle-inspection/components/InspectionDetails.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import CommonFooter from "../../../../components/footer/commonFooter";
import { useInspection } from "../hooks/useInspection";

const InspectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { inspection, fetchInspection, loading } = useInspection();

  useEffect(() => {
    if (id) {
      fetchInspection(parseInt(id));
    }
  }, [id, fetchInspection]);

  // Export to Excel function - Fixed alignment
  const exportToExcel = () => {
    if (!inspection) return;

    const excelData = [
      {
        'A': 'Inspection ID',
        'B': `#INSP-${String(inspection.id).padStart(4, '0')}`,
        'C': 'Inspection Type',
        'D': inspection.inspection_type?.toUpperCase(),
        'E': 'Vehicle No.',
        'F': inspection.vehicle_no,
        'G': 'Status',
        'H': inspection.status?.toUpperCase(),
      },
      {
        'A': 'Location',
        'B': inspection.location,
        'C': 'Date',
        'D': inspection.date,
        'E': 'Time',
        'F': inspection.time,
        'G': '',
        'H': '',
      },
      {
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'PARAMETER',
        'B': 'VALUE',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'Vehicle Condition',
        'B': inspection.vehicle_condition,
        'C': 'Insects',
        'D': inspection.insects,
        'E': 'Undesirable Odour',
        'F': inspection.undesirable_odour,
        'G': 'Nail/Bolt Projection',
        'H': inspection.nail_bolt_projection,
      },
      {
        'A': 'Covered from Top',
        'B': inspection.covered_from_top,
        'C': 'Camera Check',
        'D': inspection.camera_check,
        'E': 'Proper Holding by Rope',
        'F': inspection.proper_holding_rope,
        'G': '',
        'H': '',
      },
      {
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'ADDITIONAL DETAILS',
        'B': 'VALUE',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'Vehicle Floorboard',
        'B': inspection.floorboard_ok,
        'C': 'Waste / Spoilage Food',
        'D': inspection.waste_spoilage,
        'E': 'Oil/Grease/Chemicals',
        'F': inspection.oil_grease_chemicals,
        'G': '',
        'H': '',
      },
      {
        'A': 'Garbage',
        'B': inspection.garbage,
        'C': 'Insect/Rodent Activity',
        'D': inspection.insect_rodent_activity,
        'E': 'Bad Odour',
        'F': inspection.bad_odour,
        'G': '',
        'H': '',
      },
      {
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'OBSERVATION',
        'B': inspection.observation || 'N/A',
        'C': 'REMARKS',
        'D': inspection.remarks || 'N/A',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'Checked By (QC)',
        'B': inspection.checked_by || 'Not assigned',
        'C': 'Verified By',
        'D': inspection.verified_by || 'Not verified',
        'E': 'Lock Status',
        'F': inspection.is_locked ? 'Locked' : 'Unlocked',
        'G': '',
        'H': '',
      },
      {
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      },
      {
        'A': 'MATERIALS',
        'B': '',
        'C': 'Lot Number',
        'D': '',
        'E': 'Quantity',
        'F': '',
        'G': 'Unit',
        'H': 'Remark',
      },
    ];

    if (inspection.items?.length > 0) {
      inspection.items.forEach((item) => {
        excelData.push({
          'A': item.material_name,
          'B': '',
          'C': item.lot_number || '',
          'D': '',
          'E': item.quantity?.toString() || '0',
          'F': '',
          'G': item.unit || '',
          'H': item.remark || '',
        });
      });
    } else {
      excelData.push({
        'A': 'No materials recorded',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
        'H': '',
      });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    ws['!cols'] = [
      { wch: 25 },  // A
      { wch: 20 },  // B
      { wch: 25 },  // C
      { wch: 20 },  // D
      { wch: 20 },  // E
      { wch: 15 },  // F
      { wch: 15 },  // G
      { wch: 25 },  // H
    ];

    ws['!merges'] = [
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
      { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
      { s: { r: 15, c: 0 }, e: { r: 15, c: 1 } },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Inspection');
    
    const filename = `Inspection_${inspection.vehicle_no}_${inspection.date}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // Export to XML function
  const exportToXML = () => {
    if (!inspection) return;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<VehicleInspection>\n';
    xml += `  <InspectionID>#INSP-${String(inspection.id).padStart(4, '0')}</InspectionID>\n`;
    xml += `  <InspectionType>${inspection.inspection_type?.toUpperCase()}</InspectionType>\n`;
    xml += `  <VehicleNo>${inspection.vehicle_no}</VehicleNo>\n`;
    xml += `  <Location>${inspection.location}</Location>\n`;
    xml += `  <Date>${inspection.date}</Date>\n`;
    xml += `  <Time>${inspection.time}</Time>\n`;
    xml += `  <Status>${inspection.status?.toUpperCase()}</Status>\n`;
    xml += `  <LockStatus>${inspection.is_locked ? 'Locked' : 'Unlocked'}</LockStatus>\n`;
    xml += '  <InspectionParameters>\n';
    xml += `    <VehicleCondition>${inspection.vehicle_condition}</VehicleCondition>\n`;
    xml += `    <Insects>${inspection.insects}</Insects>\n`;
    xml += `    <UndesirableOdour>${inspection.undesirable_odour}</UndesirableOdour>\n`;
    xml += `    <NailBoltProjection>${inspection.nail_bolt_projection}</NailBoltProjection>\n`;
    xml += `    <CoveredFromTop>${inspection.covered_from_top}</CoveredFromTop>\n`;
    xml += `    <CameraCheck>${inspection.camera_check}</CameraCheck>\n`;
    xml += `    <ProperHoldingByRope>${inspection.proper_holding_rope}</ProperHoldingByRope>\n`;
    xml += '  </InspectionParameters>\n';
    xml += '  <AdditionalDetails>\n';
    xml += `    <VehicleFloorboard>${inspection.floorboard_ok}</VehicleFloorboard>\n`;
    xml += `    <WasteSpoilageFood>${inspection.waste_spoilage}</WasteSpoilageFood>\n`;
    xml += `    <OilGreaseChemicals>${inspection.oil_grease_chemicals}</OilGreaseChemicals>\n`;
    xml += `    <Garbage>${inspection.garbage}</Garbage>\n`;
    xml += `    <InsectRodentActivity>${inspection.insect_rodent_activity}</InsectRodentActivity>\n`;
    xml += `    <BadOdour>${inspection.bad_odour}</BadOdour>\n`;
    xml += '  </AdditionalDetails>\n';
    xml += `  <Observation>${inspection.observation || 'N/A'}</Observation>\n`;
    xml += `  <Remarks>${inspection.remarks || 'N/A'}</Remarks>\n`;
    xml += '  <Materials>\n';
    
    if (inspection.items?.length > 0) {
      inspection.items.forEach((item) => {
        xml += '    <Material>\n';
        xml += `      <Name>${item.material_name}</Name>\n`;
        xml += `      <LotNumber>${item.lot_number || ''}</LotNumber>\n`;
        xml += `      <Quantity>${item.quantity || 0}</Quantity>\n`;
        xml += `      <Unit>${item.unit || ''}</Unit>\n`;
        xml += `      <Remark>${item.remark || ''}</Remark>\n`;
        xml += '    </Material>\n';
      });
    } else {
      xml += '    <Material>\n';
      xml += '      <Name>No materials</Name>\n';
      xml += '      <LotNumber>N/A</LotNumber>\n';
      xml += '      <Quantity>0</Quantity>\n';
      xml += '      <Unit>N/A</Unit>\n';
      xml += '      <Remark>N/A</Remark>\n';
      xml += '    </Material>\n';
    }
    
    xml += '  </Materials>\n';
    xml += `  <CheckedBy>${inspection.checked_by || 'Not assigned'}</CheckedBy>\n`;
    xml += `  <VerifiedBy>${inspection.verified_by || 'Not verified'}</VerifiedBy>\n`;
    xml += '</VehicleInspection>';

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inspection_${inspection.vehicle_no}_${inspection.date}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              <h4>Inspection Details</h4>
              <h6>Inspection #{inspection.id} - {inspection.vehicle_no}</h6>
            </div>
          </div>
          <div className="page-btn d-flex gap-2">
            <button 
              className="btn btn-success me-2" 
              onClick={exportToExcel}
              title="Export to Excel"
            >
              <i className="ti ti-file-spreadsheet me-1" /> Excel
            </button>
            <button 
              className="btn btn-primary me-2" 
              onClick={exportToXML}
              title="Export to XML for Tally"
            >
              <i className="ti ti-file-code me-1" /> XML
            </button>
            <Link to="/quality-control/vehicle-inspections" className="btn btn-secondary me-2">
              <i className="ti ti-arrow-left me-1" /> Back
            </Link>
            {(inspection.status === 'draft' || inspection.status === 'revised') && (
              <Link to={`/quality-control/vehicle-inspections/edit/${inspection.id}`} className="btn btn-primary">
                <i className="ti ti-edit me-1" /> Edit
              </Link>
            )}
            {inspection.status === 'under_review' && (
              <Link to={`/quality-control/vehicle-inspections/review/${inspection.id}`} className="btn btn-primary">
                <i className="ti ti-eye me-1" /> Review
              </Link>
            )}
          </div>
        </div>

        {/* ... rest of the component remains the same ... */}
        <div className="card">
          <div className="card-body">
            {/* Header Info */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="fw-bold">Inspection Type</label>
                <p><span className="badge bg-info">{inspection.inspection_type?.toUpperCase()}</span></p>
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Vehicle No.</label>
                <p className="fw-bold">{inspection.vehicle_no}</p>
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Date</label>
                <p>{inspection.date}</p>
              </div>
              <div className="col-md-3">
                <label className="fw-bold">Status</label>
                <p><span className={`badge ${inspection.status === 'approved' ? 'badge-success' : 
                  inspection.status === 'rejected' ? 'badge-danger' : 
                  inspection.status === 'under_review' ? 'badge-primary' : 
                  inspection.status === 'submitted' ? 'badge-info' : 'badge-warning'}`}>
                  {inspection.status?.toUpperCase()}
                </span></p>
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
                <table className="table table-sm">
                  <tbody>
                    <tr><td><strong>Vehicle Condition:</strong></td><td>{inspection.vehicle_condition}</td></tr>
                    <tr><td><strong>Insects:</strong></td><td>{inspection.insects}</td></tr>
                    <tr><td><strong>Undesirable Odour:</strong></td><td>{inspection.undesirable_odour}</td></tr>
                    <tr><td><strong>Nail/Bolt Projection:</strong></td><td>{inspection.nail_bolt_projection}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-sm">
                  <tbody>
                    <tr><td><strong>Covered from Top:</strong></td><td>{inspection.covered_from_top}</td></tr>
                    <tr><td><strong>Camera Check:</strong></td><td>{inspection.camera_check}</td></tr>
                    <tr><td><strong>Proper Holding by Rope:</strong></td><td>{inspection.proper_holding_rope}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Details */}
            <h6 className="border-bottom pb-2 mb-3">Additional Inspection Details</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <table className="table table-sm">
                  <tbody>
                    <tr><td><strong>Vehicle Floorboard:</strong></td><td>{inspection.floorboard_ok}</td></tr>
                    <tr><td><strong>Waste / Spoilage Food:</strong></td><td>{inspection.waste_spoilage}</td></tr>
                    <tr><td><strong>Oil/Grease/Chemicals:</strong></td><td>{inspection.oil_grease_chemicals}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-sm">
                  <tbody>
                    <tr><td><strong>Garbage:</strong></td><td>{inspection.garbage}</td></tr>
                    <tr><td><strong>Insect/Rodent Activity:</strong></td><td>{inspection.insect_rodent_activity}</td></tr>
                    <tr><td><strong>Bad Odour:</strong></td><td>{inspection.bad_odour}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Materials */}
            <h6 className="border-bottom pb-2 mb-3">Materials</h6>
            <div className="table-responsive mb-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
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
                      <td>{index + 1}</td>
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
                <p className="border p-2 rounded bg-light">{inspection.observation || 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold">Remarks</label>
                <p className="border p-2 rounded bg-light">{inspection.remarks || 'N/A'}</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="fw-bold">Checked By (QC)</label>
                <p className="border-bottom pb-1">{inspection.checked_by || 'Not assigned'}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold">Verified By</label>
                <p className="border-bottom pb-1">{inspection.verified_by || 'Not verified'}</p>
              </div>
            </div>

            {/* Lock Status & Export */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label className="fw-bold me-2">Lock Status:</label>
                {inspection.is_locked ? (
                  <span className="badge badge-danger">
                    <i className="ti ti-lock me-1" /> Locked {inspection.locked_at ? `at ${new Date(inspection.locked_at).toLocaleString()}` : ''}
                  </span>
                ) : (
                  <span className="badge badge-success">
                    <i className="ti ti-lock-open me-1" /> Unlocked
                  </span>
                )}
              </div>
              <div className="col-md-6 text-end d-flex gap-2 justify-content-end">
                <button 
                  className="btn btn-success" 
                  onClick={exportToExcel}
                  title="Export to Excel"
                >
                  <i className="ti ti-file-spreadsheet me-1" /> Excel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={exportToXML}
                  title="Export to XML for Tally"
                >
                  <i className="ti ti-file-code me-1" /> XML
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default InspectionDetails;