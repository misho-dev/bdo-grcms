import React, { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import CustomToolbar from "../components/CustomToolbar";
import CustomDataTable from "../components/CustomDataTable";
import axios from "axios";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom"; // To get the organization ID from the URL
import CustomModal from "../components/CustomModal";
import AssetForm from "../forms/AssetForm";
import FilterForm from "../forms/FilterForm";
import { useFetchAssets } from "../hooks/useFetchAssets";
import { useDeleteAsset } from "../hooks/useDeleteAsset";
import { useSaveAsset } from "../hooks/useSaveAsset";
import { useImportAssets } from "../hooks/useImportAssets";

const AssetInventoryPage = () => {
  const { orgId } = useParams(); // Get the organization ID from the URL
  const [assets, setAssets] = useFetchAssets(orgId);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [formDefaultValues, setFormDefaultValues] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [filters, setFilters] = useState({ name: "", type: "" });
  const [showFilterModal, setShowFilterModal] = useState(false);

  const deleteAsset = useDeleteAsset(
    orgId,
    assets,
    setAssets,
    setSelectedAsset
  );
  const saveAsset = useSaveAsset(setAssets, setShowAssetForm, setSelectedAsset);
  const importAssets = useImportAssets(setAssets, orgId);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const handleSelectRow = (asset) => {
    setSelectedAsset(asset);
  };

  // Add, Edit, and Remove handlers (to be implemented)
  const handleAddAsset = () => {
    setShowAssetForm(true);
  };

  const handleEditAsset = () => {
    if (selectedAsset) {
      // Set form default values to the selected asset's data
      setFormDefaultValues(selectedAsset);
      setShowAssetForm(true); // Show the form modal
    } else {
      alert("Please select an asset to edit.");
    }
  };

  const handleDeleteAsset = async () => {
    if (selectedAsset && selectedAsset.id) {
      deleteAsset(selectedAsset.id);
    } else {
      alert("Please select an asset to delete.");
    }
  };

  const handleSubmitAssetForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAsset = extractFormData(formData);
    newAsset.organizationId = orgId;

    const assetId = selectedAsset ? selectedAsset.id : undefined;

    saveAsset(newAsset, assetId);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name); // Update the file name state
    }
  };

  // Handle file upload
  const handleImportAssets = () => {
    if (!selectedFile) {
      alert("Please select a file to import.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("orgId", orgId); // Append orgId if needed by the backend

    axios
      .post(`${SERVER_URL}/api/assets/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Assets imported successfully");
        // Optionally refresh the assets list here
      })
      .catch((error) => {
        console.error("Error importing assets:", error);
        alert("Error importing assets");
      });
  };

  const handleExportAssets = () => {
    window.location.href = `${SERVER_URL}/api/assets/export/${orgId}`;
  };

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const fetchFilteredAssets = () => {
    const queryParams = new URLSearchParams();
    if (filters.name) queryParams.append("name", filters.name || ""); // Example for optional string parameter
    // For enums or similar, ensure the value is correctly formatted or defaulted
    if (filters.criticality)
      queryParams.append("criticality", filters.criticality || "");
    if (filters.confidentiality)
      queryParams.append("confidentiality", filters.confidentiality || "");
    if (filters.availability)
      queryParams.append("availability", filters.availability || "");
    if (filters.integrity)
      queryParams.append("integrity", filters.integrity || "");
    if (filters.owner) queryParams.append("owner", filters.owner || "");
    if (filters.location)
      queryParams.append("location", filters.location || "");
    if (filters.department)
      queryParams.append("department", filters.department || "");
    // For numeric values, convert to string, handle null/undefined cases
    if (filters.minRetentionPeriod)
      queryParams.append(
        "minRetentionPeriod",
        filters.minRetentionPeriod ? filters.minRetentionPeriod.toString() : ""
      );
    if (filters.maxRetentionPeriod)
      queryParams.append(
        "maxRetentionPeriod",
        filters.maxRetentionPeriod ? filters.maxRetentionPeriod.toString() : ""
      );
    // Handle BigInteger in JavaScript: assuming these values are handled as strings
    if (filters.minFinancialValue)
      queryParams.append("minFinancialValue", filters.minFinancialValue || "");
    if (filters.maxFinancialValue)
      queryParams.append("maxFinancialValue", filters.maxFinancialValue || "");
    // For dates, convert to the expected format (ISO 8601 string)
    if (filters.startDate)
      queryParams.append(
        "startDate",
        filters.startDate ? filters.startDate.toISOString().split("T")[0] : ""
      );
    if (filters.endDate)
      queryParams.append(
        "endDate",
        filters.endDate ? filters.endDate.toISOString().split("T")[0] : ""
      );
    if (filters.status) queryParams.append("status", filters.status || "");
    if (filters.type) queryParams.append("type", filters.type || "");

    axios
      .get(
        `${SERVER_URL}/api/assets/organization?orgId=${orgId}&${queryParams}`
      )
      .then((response) => {
        setAssets(response.data);
        setShowFilterModal(false);
      })
      .catch((error) =>
        console.error("Error fetching filtered assets:", error)
      );
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredAssets();
    handleCloseFilterModal();
  };

  // Function to clear filters
  const handleClearFilters = () => {
    setFilters({ name: "", type: "" });
    fetchFilteredAssets(); // Or your initial fetch function to reset the data
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "version", label: "Version", minWidth: 150 },
    { id: "criticality", label: "Criticality", minWidth: 100 },
    { id: "confidentiality", label: "Confidentiality", minWidth: 100 },
    { id: "availability", label: "Availability", minWidth: 100 },
    { id: "integrity", label: "Integrity", minWidth: 100 },
    { id: "owner", label: "Owner", minWidth: 100 },
    { id: "location", label: "Location", minWidth: 100 },
    { id: "department", label: "Department", minWidth: 100 },
    { id: "retentionPeriod", label: "Retention Period", minWidth: 100 },
    { id: "acquisitionDate", label: "Acquisition Date", minWidth: 100 },
    { id: "dateOfDisposal", label: "Date of Disposal", minWidth: 100 },
    { id: "financialValue", label: "Financial Value", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "type", label: "Type", minWidth: 100 },
  ];

  const extractFormData = (formData) => {
    let asset = {};
    for (let [key, value] of formData.entries()) {
      switch (key) {
        case "retentionPeriod":
          asset[key] = parseInt(value, 10);
          break;
        case "financialValue":
          asset[key] = parseFloat(value);
          break;
        default:
          asset[key] = value;
      }
    }
    return asset;
  };

  return (
    <div style={{width: "calc(100vw - 280px)"}}>
      <PageTitle title="Asset Inventory" />
      <CustomToolbar>
        <Button variant="contained" onClick={handleAddAsset}>
          Add
        </Button>
        <Button variant="contained" onClick={handleEditAsset}>
          Edit
        </Button>
        <Button variant="contained" onClick={handleDeleteAsset}>
          Remove
        </Button>
        <Button variant="contained" onClick={handleExportAssets}>
          Export
        </Button>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="import-file-input"
          accept=".xlsx, .xls"
        />
        <label htmlFor="import-file-input">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        {selectedFileName && <span>Selected File: {selectedFileName}</span>}
        <Button variant="contained" onClick={handleImportAssets}>
          Import
        </Button>
        <Button variant="contained" onClick={handleOpenFilterModal}>
          Filter
        </Button>
        <Button variant="contained" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </CustomToolbar>
      <CustomDataTable
        columns={columns}
        data={assets}
        onSelectRow={handleSelectRow}
        selectedRow={selectedAsset ? selectedAsset.id : null}
      />
      {showAssetForm && (
        <CustomModal
          open={showAssetForm}
          handleClose={() => setShowAssetForm(false)}
          title="Add Asset"
        >
          <AssetForm
            onSubmit={handleSubmitAssetForm}
            defaultValues={formDefaultValues}
          />
        </CustomModal>
      )}
      {showFilterModal && (
        <CustomModal
          open={showFilterModal}
          handleClose={handleCloseFilterModal}
          title="Filter Assets"
        >
          <FilterForm filters={filters} setFilters={setFilters} />
          <Button onClick={fetchFilteredAssets}>Save Filters</Button>
        </CustomModal>
      )}
    </div>
  );
};

export default AssetInventoryPage;
