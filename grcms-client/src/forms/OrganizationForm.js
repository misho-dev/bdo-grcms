// Example for OrganizationForm.js
import React from 'react';
import { TextField, Button } from '@mui/material';

// OrganizationForm.js
const OrganizationForm = ({ onSubmit, organization }) => {
    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" defaultValue={organization ? organization.name : ''} />
            {/* Other fields */}
            <button type="submit">Submit</button>
        </form>
    );
};


export default OrganizationForm;
