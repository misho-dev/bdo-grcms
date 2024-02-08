package com.bdo.bdogrcms.model.specifications;

import com.bdo.bdogrcms.enums.Level;
import com.bdo.bdogrcms.enums.Status;
import com.bdo.bdogrcms.enums.Type;
import com.bdo.bdogrcms.model.Asset;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigInteger;
import java.util.Date;

public class AssetSpecifications {
    public static Specification<Asset> hasName(String name) {
        return (asset, cq, cb) -> {
            if (name == null || name.isEmpty()) {
                return cb.isTrue(cb.literal(true)); // always true = no filtering
            }
            return cb.like(asset.get("name"), "%" + name + "%");
        };
    }

    public static Specification<Asset> hasType(Type type) {
        return (asset, cq, cb) -> type == null ? cb.isTrue((cb.literal(true))) : cb.equal(asset.get("type"), type);
    }


    public static Specification<Asset> hasCriticality(Level criticality) {
        return (asset, cq, cb) -> criticality == null ? cb.isTrue(cb.literal(true)) : cb.equal(asset.get("criticality"), criticality);
    }

    public static Specification<Asset> hasConfidentiality(Level confidentiality) {
        return (asset, cq, cb) -> confidentiality == null ? cb.isTrue(cb.literal(true)) : cb.equal(asset.get("confidentiality"), confidentiality);
    }

    public static Specification<Asset> hasAvailability(Level availability) {
        return (asset, cq, cb) -> availability == null ? cb.isTrue(cb.literal(true)) : cb.equal(asset.get("availability"), availability);
    }

    public static Specification<Asset> hasIntegrity(Level integrity) {
        return (asset, cq, cb) -> integrity == null ? cb.isTrue(cb.literal(true)) : cb.equal(asset.get("integrity"), integrity);
    }

    public static Specification<Asset> hasOwner(String owner) {
        return (asset, cq, cb) -> {
            if (owner == null || owner.isEmpty()) {
                return cb.isTrue(cb.literal(true));
            }
            return cb.like(cb.lower(asset.get("owner")), "%" + owner.toLowerCase() + "%");
        };
    }

    public static Specification<Asset> hasLocation(String location) {
        return (asset, cq, cb) -> {
            if (location == null || location.isEmpty()) {
                return cb.isTrue(cb.literal(true));
            }
            return cb.like(cb.lower(asset.get("location")), "%" + location.toLowerCase() + "%");
        };
    }

    public static Specification<Asset> hasDepartment(String department) {
        return (asset, cq, cb) -> {
            if (department == null || department.isEmpty()) {
                return cb.isTrue(cb.literal(true));
            }
            return cb.like(cb.lower(asset.get("department")), "%" + department.toLowerCase() + "%");
        };
    }

    public static Specification<Asset> hasRetentionPeriod(Integer minRetentionPeriod, Integer maxRetentionPeriod) {
        return (asset, cq, cb) -> {
            if (minRetentionPeriod == null && maxRetentionPeriod == null) {
                return cb.isTrue(cb.literal(true));
            }
            if (minRetentionPeriod == null) {
                return cb.lessThanOrEqualTo(asset.get("retentionPeriod"), maxRetentionPeriod);
            }
            if (maxRetentionPeriod == null) {
                return cb.greaterThanOrEqualTo(asset.get("retentionPeriod"), minRetentionPeriod);
            }
            return cb.between(asset.get("retentionPeriod"), minRetentionPeriod, maxRetentionPeriod);
        };
    }

    public static Specification<Asset> hasFinancialValue(BigInteger minFinancialValue, BigInteger maxFinancialValue) {
        return (asset, cq, cb) -> {
            if (minFinancialValue == null && maxFinancialValue == null) {
                return cb.isTrue(cb.literal(true));
            }
            if (minFinancialValue == null) {
                return cb.lessThanOrEqualTo(asset.get("financialValue"), maxFinancialValue);
            }
            if (maxFinancialValue == null) {
                return cb.greaterThanOrEqualTo(asset.get("financialValue"), minFinancialValue);
            }
            return cb.between(asset.get("financialValue"), minFinancialValue, maxFinancialValue);
        };
    }

    public static Specification<Asset> hasAcquisitionDateRange(Date startDate, Date endDate) {
        return (asset, cq, cb) -> {
            if (startDate == null || endDate == null) {
                return cb.isTrue(cb.literal(true));
            }
            return cb.between(asset.get("acquisitionDate"), startDate, endDate);
        };
    }

    public static Specification<Asset> hasStatus(Status status) {
        return (asset, cq, cb) -> status == null ? cb.isTrue(cb.literal(true)) : cb.equal(asset.get("status"), status);
    }
}
