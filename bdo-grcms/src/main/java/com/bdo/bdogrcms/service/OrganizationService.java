package com.bdo.bdogrcms.service;

import com.bdo.bdogrcms.model.Organization;

import java.util.List;
import java.util.Optional;

public interface OrganizationService {

    List<Organization> findAllOrganizations();

    Optional<Organization> findOrganizationById(Long id);

    Organization saveOrganization(Organization organization);

    void deleteOrganization(Long id);

    // Additional methods as needed
}