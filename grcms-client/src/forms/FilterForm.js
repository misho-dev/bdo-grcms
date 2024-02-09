import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const FilterForm = ({ filters, setFilters }) => {
    const levels = ['LOW', 'MEDIUM', 'HIGH'];
    const statuses = ['ACTIVE', 'INACTIVE', 'DISPOSED'];
    const types = [
        'LAPTOP', 'WORKSTATION', 'PHYSICAL_SERVER', 'VIRTUAL_SERVER', 
        'HARD_COPY_DOCUMENT', 'PHYSICAL_LOCATION', 'CLOUD_SERVICE', 
        '_3RD_PARTY_APP', 'DATABASE', 'HARDWARE', 'INFORMATION', 
        'PHYSICAL_ASSET', 'BUSINESS_PROCESS'
    ];

    return (
        <form>
            {/* Existing inputs for name, type, criticality, status */}
            <TextField
                id="name"
                label="Name"
                value={filters.name || ''}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="criticality">Criticality</InputLabel>
                <Select
                    id="criticality"
                    value={filters.criticality || ''}
                    onChange={(e) => setFilters({ ...filters, criticality: e.target.value })}
                >
                    <MenuItem value="">Select Criticality</MenuItem>
                    {levels.map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                    id="status"
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <MenuItem value="">Select Status</MenuItem>
                    {statuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="type">Type</InputLabel>
                <Select
                    id="type"
                    value={filters.type || ''}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <MenuItem value="">Select Type</MenuItem>
                    {types.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Confidentiality */}
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="confidentiality">confidentiality</InputLabel>
                <Select
                    id="confidentiality"
                    value={filters.confidentiality || ''}
                    onChange={(e) => setFilters({ ...filters, confidentiality: e.target.value })}
                >
                    <MenuItem value="">Select Confidentiality Level</MenuItem>
                    {levels.map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Availability */}
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="availability">Availability</InputLabel>
                <Select
                    id="availability"
                    value={filters.availability || ''}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                >
                    <MenuItem value="">Select Availability Level</MenuItem>
                    {levels.map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Integrity */}
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="integrity">Integrity</InputLabel>
                <Select
                    id="integrity"
                    value={filters.integrity || ''}
                    onChange={(e) => setFilters({ ...filters, integrity: e.target.value })}
                >
                    <MenuItem value="">Select integrity Level</MenuItem>
                    {levels.map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                </Select>
            </FormControl>


            {/* Owner */}
            <TextField
                fullWidth margin="normal"
                id="owner"
                label="Owner"
                value={filters.owner || ''}
                onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            />

            {/* Location */}
            <TextField
                fullWidth margin="normal"
                id="location"
                label="Location"
                value={filters.location || ''}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />

            {/* Department */}
            <TextField
                fullWidth margin="normal"
                id="department"
                label="Department"
                value={filters.department || ''}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            />


            {/* Additional filters can be implemented in a similar fashion */}
        </form>
    );
};

export default FilterForm;
