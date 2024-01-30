package com.bdo.bdogrcms.service;

import com.bdo.bdogrcms.model.Asset;

import java.util.List;
import java.util.Optional;

public interface AssetService {

    List<Asset> findAllAssets();

    Optional<Asset> findAssetById(Long id);

    Asset saveAsset(Asset asset);

    void deleteAsset(Long id);

    // Additional methods as needed for asset-specific business logic
}
