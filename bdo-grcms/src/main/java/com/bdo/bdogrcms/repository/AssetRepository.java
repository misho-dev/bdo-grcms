package com.bdo.bdogrcms.repository;

import com.bdo.bdogrcms.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByOrganizationId(Long organizationId);
}
