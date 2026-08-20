// src/feature-module/people/customers/components/TallyMapping.tsx

import { useState } from "react";
import { useCustomer } from "../hooks/useCustomer";
import type { Customer } from "../types";

interface TallyMappingProps {
  customerId: number;
  customer: Customer;
}

const TallyMapping = ({ customerId, customer }: TallyMappingProps) => {
  const { updateTallyMapping, validateTally, exportToXML } = useCustomer();
  const [tallyCode, setTallyCode] = useState(customer.tally_ledger_code || '');
  const [tallyName, setTallyName] = useState(customer.tally_ledger_name || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!tallyCode || !tallyName) {
      alert('Please enter both Tally Code and Name');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateTallyMapping(customerId, {
        tally_ledger_code: tallyCode,
        tally_ledger_name: tallyName
      });
      if (result) {
        alert('Tally mapping saved successfully!');
      }
    } catch (error) {
      alert('Failed to save Tally mapping');
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    if (!tallyCode) {
      alert('Please enter Tally Code first');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    try {
      const result = await validateTally(customerId);
      if (result) {
        setValidationResult({
          success: result.success,
          message: result.message || (result.success ? 'Validation successful!' : 'Validation failed!')
        });
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: 'Error validating Tally mapping'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // First validate
      const validation = await validateTally(customerId);
      if (!validation || !validation.success) {
        alert('Please validate the Tally mapping before exporting');
        setIsExporting(false);
        return;
      }

      // Then export
      const result = await exportToXML(customerId);
      if (result) {
        alert('XML exported successfully!');
      }
    } catch (error) {
      alert('Failed to export XML');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Tally Ledger Mapping</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tally Ledger Code *</label>
              <input
                type="text"
                className="form-control"
                value={tallyCode}
                onChange={(e) => setTallyCode(e.target.value)}
                placeholder="Enter Tally ledger code"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tally Ledger Name *</label>
              <input
                type="text"
                className="form-control"
                value={tallyName}
                onChange={(e) => setTallyName(e.target.value)}
                placeholder="Enter Tally ledger name"
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="fw-bold">Sync Status:</label>
          <span className={`badge ms-2 ${
            customer.tally_sync_status === 'synced' ? 'badge-success' :
            customer.tally_sync_status === 'error' ? 'badge-danger' : 'badge-warning'
          }`}>
            {customer.tally_sync_status || 'pending'}
          </span>
          {customer.tally_last_synced_at && (
            <span className="ms-2 text-muted small">
              Last synced: {new Date(customer.tally_last_synced_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="mb-3">
          <label className="fw-bold">XML Export Status:</label>
          <span className={`badge ms-2 ${
            customer.xml_export_status === 'exported' ? 'badge-success' :
            customer.xml_export_status === 'error' ? 'badge-danger' : 'badge-warning'
          }`}>
            {customer.xml_export_status || 'pending'}
          </span>
        </div>

        {validationResult && (
          <div className={`alert ${validationResult.success ? 'alert-success' : 'alert-danger'}`}>
            {validationResult.message}
          </div>
        )}

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Mapping'}
          </button>
          <button
            className="btn btn-warning"
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
          <button
            className="btn btn-success"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export to XML'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-light rounded">
          <h6>Business Rules:</h6>
          <ul className="mb-0">
            <li>Customers already exist in Tally</li>
            <li>Customer mapping must be validated before XML export</li>
            <li>Sync status shows if mapping is synced with Tally</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TallyMapping;