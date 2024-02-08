// hooks/useFetchAssets.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchAssets = (orgId, filters = {}) => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const params = new URLSearchParams({ ...filters, orgId }).toString();
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/assets?${params}`);
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    if (orgId) {
      fetchAssets();
    }
  }, [orgId, filters.name, filters.type]); // Depend on orgId, name, and type so it refetches when these change

  return [assets, setAssets];
};
