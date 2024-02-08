import React, { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import CustomToolbar from "../components/CustomToolbar";
import CustomDataTable from "../components/CustomDataTable";
import axios from "axios";
import MainContainer from "../components/MainContainer";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal";
import OrganizationForm from "../forms/OrganizationForm";

const OrganizationManagementPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  // Fetch organizations from backend on component mount
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/organizations`)
      .then((response) => {
        console.log(response.data);
        setOrganizations(response.data);
      })
      .catch((error) => console.error("Error fetching organizations:", error));
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAddOrganization = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newOrganization = {
      name: formData.get("name"),
      // Add other fields as needed
    };

    axios
      .post(`${SERVER_URL}/api/organizations`, newOrganization)
      .then((response) => {
        setOrganizations([...organizations, response.data]);
        handleCloseModal();
      })
      .catch((error) => console.error("Error adding organization:", error));
  };

  // Edit an existing organization
  const handleEditOrganization = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // event.target should be the form
    const updatedOrganization = {
      name: event.target.name.value,
      // Add other fields as needed
    };

    axios
      .put(
        `${SERVER_URL}/api/organizations/${selectedOrganization.id}`,
        updatedOrganization
      )
      .then((response) => {
        setOrganizations(
          organizations.map((org) =>
            org.id === selectedOrganization.id ? response.data : org
          )
        );
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating organization:", error));
  };

  const handleDeleteOrganization = () => {
    if (selectedOrganization) {
      axios
        .delete(
          `${SERVER_URL}/api/organizations/${selectedOrganization.id}`
        )
        .then(() => {
          setOrganizations(
            organizations.filter((org) => org.id !== selectedOrganization.id)
          );
          setSelectedOrganization(null);
        })
        .catch((error) => console.error("Error deleting organization:", error));
    }
  };

  // Function to handle row selection
  const handleSelectRow = (organization) => {
    setSelectedOrganization(organization);
  };

  // Function to handle View button click
  const handleViewClick = () => {
    if (selectedOrganization) {
      navigate(`/asset-inventory/${selectedOrganization.id}`); // Navigate to Asset Inventory page
    }
  };

  // Define the columns for your data table
  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    // Add more columns as needed
  ];

  return (
    <div>
      <PageTitle title="Organization Management" />
      <CustomToolbar>
        <Button onClick={handleOpenModal}>Add</Button>
        <Button variant="contained" onClick={handleEditOrganization}>
          Edit
        </Button>
        <Button variant="contained" onClick={handleDeleteOrganization}>
          Remove
        </Button>
        <Button variant="contained" onClick={handleViewClick}>
          View
        </Button>
      </CustomToolbar>
      <CustomDataTable
        columns={columns}
        data={organizations}
        onSelectRow={handleSelectRow}
        selectedRow={selectedOrganization ? selectedOrganization.id : null}
      />
      <CustomModal
        open={modalOpen}
        handleClose={handleCloseModal}
        title={selectedOrganization ? "Edit Organization" : "Add Organization"}
      >
        <OrganizationForm
          onSubmit={
            selectedOrganization
              ? handleEditOrganization
              : handleAddOrganization
          }
          organization={selectedOrganization}
        />
      </CustomModal>
    </div>
  );
};

export default OrganizationManagementPage;
