package com.bdo.bdogrcms.model.specifications;

import com.bdo.bdogrcms.model.Asset;
import org.springframework.data.jpa.domain.Specification;

public class AssetSpecifications {
    public static Specification<Asset> hasName(String name) {
        return (asset, cq, cb) -> {
            if (name == null || name.isEmpty()) {
                return cb.isTrue(cb.literal(true)); // always true = no filtering
            }
            return cb.like(asset.get("name"), "%" + name + "%");
        };
    }

    public static Specification<Asset> hasType(String type) {
        return (asset, cq, cb) -> {
            if (type == null || type.isEmpty()) {
                return cb.isTrue(cb.literal(true));
            }
            return cb.equal(asset.get("type"), type);
        };
    }
}
