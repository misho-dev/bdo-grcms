package com.bdo.bdogrcms.controller;

import com.bdo.bdogrcms.model.Organization;
import com.bdo.bdogrcms.repository.OrganizationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest (OrganizationController.class)
public class OrganizationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrganizationRepository organizationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Organization organization;

    @BeforeEach
    void setUp() {
        organization = new Organization("BDO");
    }

    @Test
    void testCreateRetrieveDeleteOrganization() throws Exception {
        // Mock saving the organization
        given(organizationRepository.save(any(Organization.class))).willReturn(organization);

        // Mock finding the organization by ID
        given(organizationRepository.findById(anyLong())).willReturn(Optional.of(organization));

        // Mock the deletion of the organization
        willDoNothing().given(organizationRepository).deleteById(anyLong());

        // Mock finding all organizations after deletion (should be empty)
        given(organizationRepository.findAll()).willReturn(Collections.emptyList());

        // Create organization
        mockMvc.perform(post("/api/organizations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(organization)))
                .andExpect(status().isCreated());

        // Retrieve the created organization
        mockMvc.perform(get("/api/organizations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(organization.getName())));

        // Delete the organization
        mockMvc.perform(delete("/api/organizations/1"))
                .andExpect(status().isNoContent());

        // Retrieve all organizations (should be empty)
        mockMvc.perform(get("/api/organizations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
