package com.bdo.bdogrcms.controller;

import com.bdo.bdogrcms.model.Organization;
import com.bdo.bdogrcms.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizationController {

    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        List<Organization> orgs = organizationService.findAllOrganizations();
        return new ResponseEntity<>(orgs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Long id) {
        Optional<Organization> organization = organizationService.findOrganizationById(id);
        return organization.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization organization) {
        Organization savedOrganization = organizationService.saveOrganization(organization);
        return new ResponseEntity<>(savedOrganization, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(@PathVariable Long id, @RequestBody Organization organization) {
        Optional<Organization> existingOrganization = organizationService.findOrganizationById(id);
        if (existingOrganization.isPresent()) {
            organization.setId(id);
            return new ResponseEntity<>(organizationService.saveOrganization(organization), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        Optional<Organization> organization = organizationService.findOrganizationById(id);
        if (organization.isPresent()) {
            organizationService.deleteOrganization(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Additional endpoints as needed...
}
