// hooks/useImportAssets.js
import { useCallback } from 'react';
import { importAssets as importAssetsService } from '../services/assetService';

export const useImportAssets = (setAssets, orgId) => {
  const importAssets = useCallback(async (selectedFile) => {
    if (!selectedFile) {
      alert("Please select a file to import.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("orgId", orgId); // Append orgId if needed by the backend

      await importAssetsService(formData);
      alert("Assets imported successfully");
      // Optionally refresh the assets list here
      // You can call setAssets here if the API returns the updated list
    } catch (error) {
      console.error("Error importing assets:", error);
      alert("Error importing assets");
    }
  }, [orgId, setAssets]);

  return importAssets;
};
