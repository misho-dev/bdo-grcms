import React from 'react';
import { Box } from '@mui/material';

const MainContainer = ({ children }) => {
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3,}}>
            {children}
        </Box>
    );
};

export default MainContainer;
