package com.bdo.bdogrcms.service.impl;

import com.bdo.bdogrcms.model.Organization;
import com.bdo.bdogrcms.repository.OrganizationRepository;
import com.bdo.bdogrcms.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationServiceImpl(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public List<Organization> findAllOrganizations() {
        return organizationRepository.findAll();
    }

    @Override
    public Optional<Organization> findOrganizationById(Long id) {
        return organizationRepository.findById(id);
    }

    @Override
    public Organization saveOrganization(Organization organization) {
        return organizationRepository.save(organization);
    }

    @Override
    public void deleteOrganization(Long id) {
        organizationRepository.deleteById(id);
    }

    // Implement additional methods as needed
}
