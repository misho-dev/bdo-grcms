package com.bdo.bdogrcms.controller;

import com.bdo.bdogrcms.model.Asset;
import com.bdo.bdogrcms.service.AssetService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
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
        return new ResponseEntity<>(assetService.saveAsset(asset), HttpStatus.CREATED);
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

    @PostMapping("/import")
    public ResponseEntity<String> importAssetsFromExcel(@RequestParam("file") MultipartFile file, @RequestParam("orgId") Long orgId){
        try {
            assetService.importAssetsFromExcel(file, orgId);
            return ResponseEntity.ok("Assets imported successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error importing assets: " + e.getMessage());
        }
    }

    @GetMapping("/export/{orgId}")
    public void exportAssets(@PathVariable Long orgId, HttpServletResponse response) throws IOException {
        assetService.exportAssetsToExcel(response, orgId);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Asset>> getAssetsFiltered(
            @RequestParam(required = true) Long orgId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type) {

        List<Asset> filteredAssets = assetService.findByOrganizationIdAndFilters(orgId, name, type);
        return ResponseEntity.ok(filteredAssets);
    }
}
