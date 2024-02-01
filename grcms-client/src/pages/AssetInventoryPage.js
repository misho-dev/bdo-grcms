import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import CustomToolbar from '../components/CustomToolbar';
import CustomDataTable from '../components/CustomDataTable';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom'; // To get the organization ID from the URL
import CustomModal from '../components/CustomModal';
import AssetForm from '../forms/AssetForm';

const AssetInventoryPage = () => {
    const { orgId } = useParams(); // Get the organization ID from the URL
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showAssetForm, setShowAssetForm] = useState(false);
    const [formDefaultValues, setFormDefaultValues] = useState({});

    useEffect(() => {
        if (orgId) {
            axios.get(`http://localhost:8080/api/assets/organization/${orgId}`)
                .then(response => {
                    setAssets(response.data);
                })
                .catch(error => console.error("Error fetching assets for organization:", error));
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
            axios.delete(`http://localhost:8080/api/assets/${selectedAsset.id}`)
                .then(() => {
                    // Remove the deleted asset from the assets state
                    const updatedAssets = assets.filter(asset => asset.id !== selectedAsset.id);
                    setAssets(updatedAssets);
                    setSelectedAsset(null); // Reset selected asset
                })
                .catch(error => console.error("Error deleting asset:", error));
        } else {
            alert("Please select an asset to delete.");
        }
    };


    const handleSubmitAssetForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newAsset = {
            name: formData.get('name'),
            criticality: formData.get('criticality'),
            confidentiality: formData.get('confidentiality'),
            availability: formData.get('availability'),
            integrity: formData.get('integrity'),
            owner: formData.get('owner'),
            location: formData.get('location'),
            department: formData.get('department'),
            retentionPeriod: parseInt(formData.get('retentionPeriod'), 10),
            financialValue: parseFloat(formData.get('financialValue')),
            acquisitionDate: formData.get('acquisitionDate'),
            status: formData.get('status'),
            type: formData.get('type'),
            currentLifeCycleStage: formData.get('currentLifeCycleStage'),
            organizationId: orgId // Assuming this is passed from URL params
        };

        // axios.post('http://localhost:8080/api/assets', newAsset, orgId)
        //     .then(response => {
        //         console.log(newAsset);
        //         console.log(orgId)
        //         setAssets([...assets, response.data]);
        //         setShowAssetForm(false);
        //     })
        //     .catch(error => console.error("Error adding asset:", error));

        if (selectedAsset && selectedAsset.id) {
            // Edit existing asset
            axios.put(`http://localhost:8080/api/assets/${selectedAsset.id}`, newAsset)
                .then(response => {
                    const updatedAssets = assets.map(asset => 
                        asset.id === selectedAsset.id ? response.data : asset
                    );
                    setAssets(updatedAssets);
                    setShowAssetForm(false);
                    setSelectedAsset(null);
                })
                .catch(error => console.error("Error updating asset:", error));
        } else {
            // Add new asset
            formData.organizationId = orgId; // Add organization ID for new asset
            axios.post('http://localhost:8080/api/assets', newAsset, orgId)
                .then(response => {
                    setAssets([...assets, response.data]);
                    setShowAssetForm(false);
                })
                .catch(error => console.error("Error adding asset:", error));
        }

    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'criticality', label: 'Criticality', minWidth: 100 },
        { id: 'confidentiality', label: 'Confidentiality', minWidth: 100 },
        { id: 'availability', label: 'Availability', minWidth: 100 },
        { id: 'integrity', label: 'Integrity', minWidth: 100 },
        { id: 'owner', label: 'Owner', minWidth: 100 },
        { id: 'location', label: 'Location', minWidth: 100 },
        { id: 'department', label: 'Department', minWidth: 100 },
        { id: 'retentionPeriod', label: 'Retention Period', minWidth: 100 },
        { id: 'financialValue', label: 'Financial Value', minWidth: 100 },
        { id: 'acquisitionDate', label: 'Acquisition Date', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
        { id: 'type', label: 'Type', minWidth: 100 },
        { id: 'currentLifeCycleStage', label: 'Life Cycle Stage', minWidth: 150 },
    ];

    return (
        <div>
            <PageTitle title="Asset Inventory" />
            <CustomToolbar>
                <Button variant="contained" onClick={handleAddAsset}>Add</Button>
                <Button variant="contained" onClick={handleEditAsset}>Edit</Button>
                <Button variant="contained" onClick={handleDeleteAsset}>Remove</Button>
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
                    <AssetForm onSubmit={handleSubmitAssetForm} defaultValues={formDefaultValues} />
                </CustomModal>
            )}
        </div>
    );
};

export default AssetInventoryPage;
