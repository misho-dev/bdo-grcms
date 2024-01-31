import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import CustomToolbar from '../components/CustomToolbar';
import CustomDataTable from '../components/CustomDataTable';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom'; // To get the organization ID from the URL

const AssetInventoryPage = () => {
    const { orgId } = useParams(); // Get the organization ID from the URL
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        if (orgId) {
            axios.get(`http://localhost:8080/api/assets/organization/${orgId}`)
                .then(response => {
                    console.log(response.data)
                    setAssets(response.data);
                })
                .catch(error => console.error("Error fetching assets for organization:", error));
        }
    }, [orgId]); // Dependency array ensures this runs when orgId changes

    const handleSelectRow = (asset) => {
        setSelectedAsset(asset);
    };

    // Add, Edit, and Remove handlers (to be implemented)
    const handleAddAsset = () => {/* ... */};
    const handleEditAsset = () => {/* ... */};
    const handleDeleteAsset = () => {/* ... */};

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
                <Button variant="contained" color="primary" onClick={handleAddAsset}>Add</Button>
                <Button variant="contained" onClick={handleEditAsset}>Edit</Button>
                <Button variant="contained" onClick={handleDeleteAsset}>Remove</Button>
            </CustomToolbar>
            <CustomDataTable 
                columns={columns} 
                data={assets} 
                onSelectRow={handleSelectRow} 
                selectedRow={selectedAsset ? selectedAsset.id : null} 
            />
            {/* Modals for Add/Edit/Delete functionalities */}
        </div>
    );
};

export default AssetInventoryPage;
