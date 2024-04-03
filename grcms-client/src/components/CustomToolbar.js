import React from 'react';
import { Box, TextField } from '@mui/material';

const CustomToolbar = ({ children }) => {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
            <TextField label="Search" variant="outlined" size="small" />
            <Box sx={{ '& > *': { margin: 2 } }}> {/* Adjusted margin from 1 to 2 */}
                {children}
            </Box>
        </Box>
    );
};

export default CustomToolbar;
