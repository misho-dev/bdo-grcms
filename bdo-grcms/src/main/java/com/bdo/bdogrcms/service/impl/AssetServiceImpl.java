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
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.*;

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

        // Determine column order from header
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnIndices = new HashMap<>();
        for (Cell cell : headerRow) {
            columnIndices.put(cell.getStringCellValue(), cell.getColumnIndex());
        }

        // Process each row
        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header
            // Save asset if conversion is successful
            convertRowToAsset(row, columnIndices, orgId).ifPresent(assetRepository::save);
        }
        workbook.close();
    }


    private Optional<Asset> convertRowToAsset(Row row, Map<String, Integer> columnIndices, Long orgId) {
        DataFormatter formatter = new DataFormatter();
        try {
            Asset asset = new Asset();

            columnIndices.forEach((columnName, index) -> {
                Cell cell = row.getCell(index);
                String cellValue = formatter.formatCellValue(cell);
                switch (columnName.toUpperCase()) {
                    case "NAME":
                        asset.setName(cellValue);
                        break;
                    case "CRITICALITY":
                        asset.setCriticality(Level.valueOf(cellValue.toUpperCase()));
                        break;
                    case "CONFIDENTIALITY":
                        asset.setConfidentiality(Level.valueOf(cellValue.toUpperCase()));
                        break;
                    case "AVAILABILITY":
                        asset.setAvailability(Level.valueOf(cellValue.toUpperCase()));
                        break;
                    case "INTEGRITY":
                        asset.setIntegrity(Level.valueOf(cellValue.toUpperCase()));
                        break;
                    case "OWNER":
                        asset.setOwner(cellValue);
                        break;
                    case "LOCATION":
                        asset.setLocation(cellValue);
                        break;
                    case "DEPARTMENT":
                        asset.setDepartment(cellValue);
                        break;
                    case "RETENTION PERIOD":
                        // Convert string to integer safely, handling decimal values
                        double retentionPeriodDouble = Double.parseDouble(cellValue);
                        asset.setRetentionPeriod((int) retentionPeriodDouble);
                        break;
                    case "FINANCIAL VALUE":
                        // Convert string to BigInteger, handling decimal values
                        BigDecimal financialValueDecimal = new BigDecimal(cellValue);
                        asset.setFinancialValue(financialValueDecimal.toBigInteger());
                        break;
                    // Handle "ACQUISITION DATE" with care for non-date formatted cells
                    case "ACQUISITION DATE":
                        if(cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)){
                            asset.setAcquisitionDate(cell.getDateCellValue());
                        }
                        break;
                    case "STATUS":
                        asset.setStatus(Status.valueOf(cellValue.toUpperCase()));
                        break;
                    case "TYPE":
                        try {
                            asset.setType(Type.valueOf(cellValue.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            asset.setType(Type.INFORMATION); // Default to INFORMATION if type is not recognized
                        }
                        break;
                    case "VERSION":
                        asset.setVersion(cellValue);
                        break;
                }
            });
            asset.setOrganizationId(orgId); // Assuming orgId is available in scope or passed as argument
            return Optional.of(asset);
        } catch (Exception e) {
            // Log the error along with row number
            System.err.println("Skipping row " + row.getRowNum() + ": " + e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public void exportAssetsToExcel(HttpServletResponse response, Long orgId) throws IOException {
        List<Asset> assets = assetRepository.findByOrganizationId(orgId); // Fetch assets

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Assets");

        // Dynamically create header row based on asset properties
        List<String> headers = Arrays.asList("Name", "Criticality", "Confidentiality", "Availability", "Integrity", "Owner", "Location", "Department", "Retention Period", "Financial Value", "Acquisition Date", "Status", "Type", "Version");
        createHeaderRow(sheet, headers);

        // Fill data rows
        populateSheetWithData(sheet, assets);

        // Set content type and header for response
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=assets.xlsx");

        // Write workbook to the response's output stream
        try (ServletOutputStream outputStream = response.getOutputStream()) {
            workbook.write(outputStream);
        } finally {
            workbook.close();
        }
    }

    private void createHeaderRow(Sheet sheet, List<String> headers) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.size(); i++) {
            headerRow.createCell(i).setCellValue(headers.get(i));
        }
    }

    private void populateSheetWithData(Sheet sheet, List<Asset> assets) {
        DataFormatter formatter = new DataFormatter();
        int rowNum = 1;
        for (Asset asset : assets) {
            Row row = sheet.createRow(rowNum++);
            populateRowWithAssetData(row, asset, formatter);
        }
    }

    private void populateRowWithAssetData(Row row, Asset asset, DataFormatter formatter) {
        // Assuming you have getters in your Asset class for each property
        row.createCell(0).setCellValue(asset.getName());
        row.createCell(1).setCellValue(asset.getCriticality().toString());
        row.createCell(2).setCellValue(asset.getConfidentiality().toString());
        row.createCell(3).setCellValue(asset.getAvailability().toString());
        row.createCell(4).setCellValue(asset.getIntegrity().toString());
        row.createCell(5).setCellValue(asset.getOwner());
        row.createCell(6).setCellValue(asset.getLocation());
        row.createCell(7).setCellValue(asset.getDepartment());
        row.createCell(8).setCellValue(asset.getRetentionPeriod());
        row.createCell(9).setCellValue(asset.getFinancialValue().toString());
        // For date, you might want to format it
        CellStyle dateCellStyle = row.getSheet().getWorkbook().createCellStyle();
        CreationHelper createHelper = row.getSheet().getWorkbook().getCreationHelper();
        dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd-MM-yyyy"));
        Cell dateCell = row.createCell(10);
        dateCell.setCellValue(asset.getAcquisitionDate());
        dateCell.setCellStyle(dateCellStyle);
        row.createCell(11).setCellValue(asset.getStatus().toString());
        row.createCell(12).setCellValue(asset.getType().toString());
        row.createCell(13).setCellValue(asset.getVersion());
    }

    @Override
    public List<Asset> findByOrganizationIdAndFilters(Long organizationId, String name,
                                                      Level criticality, Level confidentiality, Level availability,
                                                      Level integrity, String owner, String location, String department,
                                                      Integer minRetentionPeriod, Integer maxRetentionPeriod,
                                                      BigInteger minFinancialValue, BigInteger maxFinancialValue,
                                                      Date startDate, Date endDate, Status status, Type type) {
        Specification<Asset> spec = Specification.where(null);

        if (organizationId != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("organizationId"), organizationId));
        }

        spec = spec.and(AssetSpecifications.hasName(name))
                .and(AssetSpecifications.hasType(type))
                .and(AssetSpecifications.hasCriticality(criticality))
                .and(AssetSpecifications.hasConfidentiality(confidentiality))
                .and(AssetSpecifications.hasAvailability(availability))
                .and(AssetSpecifications.hasIntegrity(integrity))
                .and(AssetSpecifications.hasOwner(owner))
                .and(AssetSpecifications.hasLocation(location))
                .and(AssetSpecifications.hasDepartment(department))
                .and(AssetSpecifications.hasRetentionPeriod(minRetentionPeriod, maxRetentionPeriod))
                .and(AssetSpecifications.hasFinancialValue(minFinancialValue, maxFinancialValue))
                .and(AssetSpecifications.hasAcquisitionDateRange(startDate, endDate))
                .and(AssetSpecifications.hasStatus(status));

        return assetRepository.findAll(spec);
    }


}
