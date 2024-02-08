// services/assetService.js
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const fetchAssets = (orgId) => axios.get(`${SERVER_URL}/api/assets/organization/${orgId}`);
const deleteAsset = (assetId) => axios.delete(`${SERVER_URL}/api/assets/${assetId}`);
const saveAsset = (asset, assetId) => assetId ? axios.put(`${SERVER_URL}/api/assets/${assetId}`, asset) : axios.post(`${SERVER_URL}/api/assets`, asset);
const importAssets = (file, orgId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orgId", orgId);
    return axios.post(`${SERVER_URL}/api/assets/import`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};
const exportAssets = (orgId) => `${SERVER_URL}/api/assets/export/${orgId}`;
const filterAssets = (orgId, filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    return axios.get(`${SERVER_URL}/api/assets/filter?orgId=${orgId}&${queryParams}`);
};

export { fetchAssets, deleteAsset, saveAsset, importAssets, exportAssets, filterAssets };
