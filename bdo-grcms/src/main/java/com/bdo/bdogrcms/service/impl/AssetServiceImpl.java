package com.bdo.bdogrcms.service.impl;

import com.bdo.bdogrcms.enums.Level;
import com.bdo.bdogrcms.enums.LifeCycleStage;
import com.bdo.bdogrcms.enums.Status;
import com.bdo.bdogrcms.enums.Type;
import com.bdo.bdogrcms.model.Asset;
import com.bdo.bdogrcms.model.specifications.AssetSpecifications;
import com.bdo.bdogrcms.repository.AssetRepository;
import com.bdo.bdogrcms.service.AssetService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.Date;
import java.util.Iterator;
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

    @Override
    public void importAssetsFromExcel(MultipartFile file, Long orgId) throws IOException {
        InputStream inputStream = file.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        sheet.forEach(row -> {
            if (row.getRowNum() != 0) { // Skip header
                String name = row.getCell(0).getStringCellValue();
                Level criticality = Level.valueOf(row.getCell(1).getStringCellValue().toUpperCase());
                Level confidentiality = Level.valueOf(row.getCell(2).getStringCellValue().toUpperCase());
                Level availability = Level.valueOf(row.getCell(3).getStringCellValue().toUpperCase());
                Level integrity = Level.valueOf(row.getCell(4).getStringCellValue().toUpperCase());
                String owner = row.getCell(5).getStringCellValue();
                String location = row.getCell(6).getStringCellValue();
                String department = row.getCell(7).getStringCellValue();
                int retentionPeriod = (int) row.getCell(8).getNumericCellValue();
                BigInteger financialValue = BigInteger.valueOf((long) row.getCell(9).getNumericCellValue());
                Date acquisitionDate = row.getCell(10).getDateCellValue();
                Status status = Status.valueOf(row.getCell(11).getStringCellValue().toUpperCase());
                Type type = Type.valueOf(row.getCell(12).getStringCellValue().toUpperCase());
                LifeCycleStage currentLifeCycleStage = LifeCycleStage.valueOf(row.getCell(13).getStringCellValue().toUpperCase());

                Asset asset = new Asset();
                asset.setName(name);
                asset.setCriticality(criticality);
                asset.setConfidentiality(confidentiality);
                asset.setAvailability(availability);
                asset.setIntegrity(integrity);
                asset.setOwner(owner);
                asset.setLocation(location);
                asset.setDepartment(department);
                asset.setRetentionPeriod(retentionPeriod);
                asset.setFinancialValue(financialValue);
                asset.setAcquisitionDate(acquisitionDate);
                asset.setStatus(status);
                asset.setType(type);
                asset.setCurrentLifeCycleStage(currentLifeCycleStage);
                asset.setOrganizationId(orgId);

                assetRepository.save(asset);
            }
        });
        workbook.close();
    }

    @Override
    public void exportAssetsToExcel(HttpServletResponse response, Long orgId) throws IOException {
        List<Asset> assets = assetRepository.findByOrganizationId(orgId); // Fetch assets for organization

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Assets");

        // Create a header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Name");
        // Add other headers

        // Fill data
        int rowNum = 1;
        for (Asset asset : assets) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(asset.getName());
            // Fill other asset details
        }

        // Set content type and header
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=assets.xlsx");

        // Write the workbook to the response's output stream
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }

    @Override
    public List<Asset> findByOrganizationIdAndFilters(Long organizationId, String name, String type) {
        Specification<Asset> spec = Specification.where(null);

        if (organizationId != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("organizationId"), organizationId));
        }

        if (name != null && !name.isEmpty()) {
            spec = spec.and(AssetSpecifications.hasName(name));
        }

        if (type != null && !type.isEmpty()) {
            spec = spec.and(AssetSpecifications.hasType(type));
        }

        return assetRepository.findAll(spec);
    }


}
