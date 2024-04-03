package com.bdo.bdogrcms.config;

import org.springframework.context.annotation.Primary;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;



@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if ((authentication == null) || !(permission instanceof String)){
            return false;
        }
        String targetType = targetDomainObject.toString(); // Assuming this is your orgId as string
        String requiredAuthority = permission + ":" + targetType;

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(requiredAuthority::equals);
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        // Implementation can be similar to hasPermission above or not needed depending on your needs
        return false;
    }
}
