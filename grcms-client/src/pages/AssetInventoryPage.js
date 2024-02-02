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

const AssetInventoryPage = () => {
  const { orgId } = useParams(); // Get the organization ID from the URL
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [formDefaultValues, setFormDefaultValues] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [filters, setFilters] = useState({ name: "", type: "" });
  const [showFilterModal, setShowFilterModal] = useState(false);
  

  const SERVER_URL = "http://192.168.169.11:8080";

  const LOCAL_URL = "http://localhost:8080"

  useEffect(() => {
    if (orgId) {
      axios
        .get(`http://192.168.169.11:8080/api/assets/organization/${orgId}`)
        .then((response) => {
          setAssets(response.data);
        })
        .catch((error) =>
          console.error("Error fetching assets for organization:", error)
        );
    }
  }, [orgId]); // Dependency array ensures this runs when orgId changes

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

  const handleDeleteAsset = () => {
    if (selectedAsset && selectedAsset.id) {
      axios
        .delete(`${SERVER_URL}/api/assets/${selectedAsset.id}`)
        .then(() => {
          // Remove the deleted asset from the assets state
          const updatedAssets = assets.filter(
            (asset) => asset.id !== selectedAsset.id
          );
          setAssets(updatedAssets);
          setSelectedAsset(null); // Reset selected asset
        })
        .catch((error) => console.error("Error deleting asset:", error));
    } else {
      alert("Please select an asset to delete.");
    }
  };

  const handleSubmitAssetForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAsset = {
      name: formData.get("name"),
      criticality: formData.get("criticality"),
      confidentiality: formData.get("confidentiality"),
      availability: formData.get("availability"),
      integrity: formData.get("integrity"),
      owner: formData.get("owner"),
      location: formData.get("location"),
      department: formData.get("department"),
      retentionPeriod: parseInt(formData.get("retentionPeriod"), 10),
      financialValue: parseFloat(formData.get("financialValue")),
      acquisitionDate: formData.get("acquisitionDate"),
      status: formData.get("status"),
      type: formData.get("type"),
      currentLifeCycleStage: formData.get("currentLifeCycleStage"),
      organizationId: orgId, // Assuming this is passed from URL params
    };

    if (selectedAsset && selectedAsset.id) {
      // Edit existing asset
      axios
        .put(`${SERVER_URL}/api/assets/${selectedAsset.id}`, newAsset)
        .then((response) => {
          const updatedAssets = assets.map((asset) =>
            asset.id === selectedAsset.id ? response.data : asset
          );
          setAssets(updatedAssets);
          setShowAssetForm(false);
          setSelectedAsset(null);
        })
        .catch((error) => console.error("Error updating asset:", error));
    } else {
      // Add new asset
      formData.organizationId = orgId; // Add organization ID for new asset
      axios
        .post(`${SERVER_URL}/api/assets`, newAsset, orgId)
        .then((response) => {
          setAssets([...assets, response.data]);
          setShowAssetForm(false);
        })
        .catch((error) => console.error("Error adding asset:", error));
    }
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
    if (filters.name) queryParams.append("name", filters.name);
    if (filters.type) queryParams.append("type", filters.type);

    axios
      .get(
        `${SERVER_URL}/api/assets/filter?orgId=${orgId}&${queryParams}`
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
    { id: "criticality", label: "Criticality", minWidth: 100 },
    { id: "confidentiality", label: "Confidentiality", minWidth: 100 },
    { id: "availability", label: "Availability", minWidth: 100 },
    { id: "integrity", label: "Integrity", minWidth: 100 },
    { id: "owner", label: "Owner", minWidth: 100 },
    { id: "location", label: "Location", minWidth: 100 },
    { id: "department", label: "Department", minWidth: 100 },
    { id: "retentionPeriod", label: "Retention Period", minWidth: 100 },
    { id: "financialValue", label: "Financial Value", minWidth: 100 },
    { id: "acquisitionDate", label: "Acquisition Date", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "type", label: "Type", minWidth: 100 },
    { id: "currentLifeCycleStage", label: "Life Cycle Stage", minWidth: 150 },
  ];

  return (
    <div>
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
