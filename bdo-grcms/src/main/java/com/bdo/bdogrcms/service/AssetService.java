package com.bdo.bdogrcms.service;

import com.bdo.bdogrcms.enums.Level;
import com.bdo.bdogrcms.enums.Status;
import com.bdo.bdogrcms.enums.Type;
import com.bdo.bdogrcms.model.Asset;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AssetService {

    List<Asset> findAllAssets();

    List<Asset> findAssetsByOrganization(Long organizationId);

    Optional<Asset> findAssetById(Long id);

    Asset saveAsset(Asset asset);

    void deleteAsset(Long id);

    // Additional methods as needed for asset-specific business logic

    void importAssetsFromExcel(MultipartFile file, Long orgId) throws IOException;

    void exportAssetsToExcel(HttpServletResponse response, Long orgId) throws IOException;

    List<Asset> findByOrganizationIdAndFilters(Long organizationId, String name,
                                               Level criticality, Level confidentiality, Level availability,
                                               Level integrity, String owner, String location, String department,
                                               Integer minRetentionPeriod, Integer maxRetentionPeriod,
                                               BigInteger minFinancialValue, BigInteger maxFinancialValue,
                                               Date startDate, Date endDate, Status status, Type type);
}
