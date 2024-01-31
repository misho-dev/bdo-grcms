package com.bdo.bdogrcms.controller;

import com.bdo.bdogrcms.model.Asset;
import com.bdo.bdogrcms.model.Organization;
import com.bdo.bdogrcms.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:3000")
public class AssetController {

    private final AssetService assetService;

    @Autowired
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        List<Asset> assets = assetService.findAllAssets();
        return new ResponseEntity<>(assets, HttpStatus.OK);
    }
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<Asset>> getAssetsByOrganization(@PathVariable Long organizationId) {
        List<Asset> assets = assetService.findAssetsByOrganization(organizationId);
        for(Asset asset : assets){
            Organization org = new Organization(asset.getOrganization().getName());
            org.setId(asset.getOrganization().getId());
            asset.setOrganization(org);
        }
        return new ResponseEntity<>(assets, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        Optional<Asset> asset = assetService.findAssetById(id);
        return asset.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        Asset newAsset = assetService.saveAsset(asset);
        return new ResponseEntity<>(newAsset, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @RequestBody Asset assetDetails) {
        return assetService.findAssetById(id)
                .map(existingAsset -> {
                    assetDetails.setId(id);
                    Asset updatedAsset = assetService.saveAsset(assetDetails);
                    return new ResponseEntity<>(updatedAsset, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        return assetService.findAssetById(id)
                .map(asset -> {
                    assetService.deleteAsset(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Additional endpoints as needed...
}
