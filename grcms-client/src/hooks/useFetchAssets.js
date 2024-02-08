// hooks/useFetchAssets.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchAssets = (orgId) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orgId) {
      setLoading(true);
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/assets/organization/${orgId}`)
        .then(response => {
          setAssets(response.data);
          setError(null); // reset the error if the fetch is successful
        })
        .catch(error => {
          console.error("Error fetching assets for organization:", error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orgId]);

  return { assets, loading, error };
};

export default useFetchAssets;
