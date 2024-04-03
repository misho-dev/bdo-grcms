// hooks/useDeleteAsset.js
import { useCallback } from 'react';
import { deleteAsset as deleteAssetService } from '../services/assetService';

export const useDeleteAsset = (orgId, assets, setAssets, setSelectedAsset) => {
  const deleteAsset = useCallback(async (assetId) => {
    try {
      await deleteAssetService(assetId);
      // Filter out the deleted asset from the assets array
      const updatedAssets = assets.filter(asset => asset.id !== assetId);
      setAssets(updatedAssets);
      setSelectedAsset(null); // Reset selected asset
    } catch (error) {
      console.error("Error deleting asset:", error);
      // Optionally, handle the error (e.g., show a notification)
    }
  }, [assets, setAssets, setSelectedAsset]);

  return deleteAsset;
};
