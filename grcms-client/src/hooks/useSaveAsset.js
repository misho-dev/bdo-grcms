// hooks/useSaveAsset.js
import { useCallback } from 'react';
import { saveAsset as saveAssetService } from '../services/assetService';

export const useSaveAsset = (setAssets, setShowAssetForm, setSelectedAsset) => {
  const saveAsset = useCallback(async (newAsset, assetId) => {
    try {
      const response = await saveAssetService(newAsset, assetId);
      if (assetId) {
        // Update existing asset in the local state
        setAssets((prevAssets) =>
          prevAssets.map((asset) => (asset.id === assetId ? response.data : asset))
        );
      } else {
        // Add new asset to the local state
        setAssets((prevAssets) => [...prevAssets, response.data]);
      }
      setShowAssetForm(false);
      setSelectedAsset(null); // Reset selected asset after save
    } catch (error) {
      console.error("Error saving asset:", error);
      // Optionally, handle the error (e.g., show an error notification)
    }
  }, [setAssets, setShowAssetForm, setSelectedAsset]);

  return saveAsset;
};
