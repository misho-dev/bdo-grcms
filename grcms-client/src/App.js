import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContainer from './components/MainContainer';
import OrganizationManagementPage from './pages/OrganizationManagementPage';
import AssetInventoryPage from './pages/AssetInventoryPage';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <MainContainer>
                    <Routes>
                      <Route path="/organizations" element={<OrganizationManagementPage />} />
                      <Route path="/asset-inventory/:orgId" element={<AssetInventoryPage />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </MainContainer>
            </div>
        </Router>
    );
}

export default App;
