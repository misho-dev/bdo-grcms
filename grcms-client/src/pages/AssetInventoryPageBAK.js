import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import CustomToolbar from '../components/CustomToolbar';
import CustomDataTable from '../components/CustomDataTable';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; // To navigate to different pages

const AssetInventoryPage = () => {
    const navigate = useNavigate();
    const testAssets = [
        // Sample test assets based on your Asset model
        { id: 1, name: 'Laptop', criticality: 'High', confidentiality: 'High', availability: 'High', integrity: 'High', owner: 'John Doe', location: 'New York', department: 'IT', retentionPeriod: 3600, financialValue: 1500, acquisitionDate: '2022-01-01', status: 'Active', type: 'Electronic', currentLifeCycleStage: 'Operational' },
        // Add more test assets as needed
    ];

    const [assets, setAssets] = useState(testAssets);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleSelectRow = (asset) => {
        setSelectedAsset(asset);
    };

    const handleViewClick = () => {
        if (selectedAsset) {
            // Logic to handle view - navigate to a different page or display details
            // Example: navigate(`/asset-details/${selectedAsset.id}`);
            console.log('Viewing asset:', selectedAsset);
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
        // Add more columns if needed
    ];

    return (
        <div>
            <PageTitle title="Asset Inventory" />
            <CustomToolbar>
                <Button variant="contained" color="primary" onClick={handleViewClick}>View</Button>
                {/* Add more buttons as needed */}
            </CustomToolbar>
            <CustomDataTable 
                columns={columns} 
                data={assets} 
                onSelectRow={handleSelectRow} 
                selectedRow={selectedAsset ? selectedAsset.id : null} 
            />
        </div>
    );
};

export default AssetInventoryPage;
