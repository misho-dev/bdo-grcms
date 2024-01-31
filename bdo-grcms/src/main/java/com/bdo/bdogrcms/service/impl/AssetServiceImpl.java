package com.bdo.bdogrcms.service.impl;

import com.bdo.bdogrcms.model.Asset;
import com.bdo.bdogrcms.repository.AssetRepository;
import com.bdo.bdogrcms.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;

    @Autowired
    public AssetServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public List<Asset> findAllAssets() {
        return assetRepository.findAll();
    }
    @Override
    public List<Asset> findAssetsByOrganization(Long organizationId) {
        return assetRepository.findByOrganizationId(organizationId);
    }
    @Override
    public Optional<Asset> findAssetById(Long id) {
        return assetRepository.findById(id);
    }

    @Override
    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    @Override
    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    // Additional methods for asset-specific business logic can be implemented here
}
