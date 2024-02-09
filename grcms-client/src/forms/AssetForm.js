import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

const AssetForm = ({ onSubmit, defaultValues }) => {
  const levels = ["LOW", "MEDIUM", "HIGH"];
  const statusOptions = ["ACTIVE", "INACTIVE", "DISPOSED"];
  const typeOptions = [
    "LAPTOP",
    "WORKSTATION",
    "PHYSICAL_SERVER",
    "VIRTUAL_SERVER",
    "HARD_COPY_DOCUMENT",
    "PHYSICAL_LOCATION",
    "CLOUD_SERVICE",
    "_3RD_PARTY_APP",
    "DATABASE",
    "HARDWARE",
    "INFORMATION",
    "PHYSICAL_ASSET",
    "BUSINESS_PROCESS",
  ];

  // Using React state to manage the retentionPeriod value
  const [retentionPeriod, setRetentionPeriod] = useState(
    defaultValues.retentionPeriod || ""
  );

  // Handle change event for the retentionPeriod TextField
  const handleRetentionPeriodChange = (event) => {
    const newValue = event.target.value;
    // Check if the new value is within the allowed range
    if (newValue <= 120 && newValue >= 0) {
      setRetentionPeriod(newValue);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        name="name"
        defaultValue={defaultValues.name}
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        required
      />

      <TextField
        name="version"
        defaultValue={defaultValues.version}
        label="Version"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select name="type" defaultValue={defaultValues.type} label="Type">
          {typeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Criticality</InputLabel>
        <Select
          name="criticality"
          defaultValue={defaultValues.criticality}
          label="Criticality"
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Confidentiality</InputLabel>
        <Select
          name="confidentiality"
          defaultValue={defaultValues.confidentiality}
          label="Confidentiality"
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Availability</InputLabel>
        <Select
          name="availability"
          defaultValue={defaultValues.availability}
          label="Availability"
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Integrity</InputLabel>
        <Select
          name="integrity"
          defaultValue={defaultValues.integrity}
          label="Integrity"
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        name="owner"
        defaultValue={defaultValues.owner}
        label="Owner"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        name="location"
        defaultValue={defaultValues.location}
        label="Location"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        name="department"
        defaultValue={defaultValues.department}
        label="Department"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        type="number"
        name="retentionPeriod"
        value={retentionPeriod}
        onChange={handleRetentionPeriodChange} // Set the onChange handler
        label="Retention Period (in Months)"
        variant="outlined"
        fullWidth
        margin="normal"
        inputProps={{
          min: 0, // Minimum value
          max: 120, // Maximum value
        }}
      />

      <TextField
        type="number"
        name="financialValue"
        defaultValue={defaultValues.financialValue}
        label="Financial Value"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        type="date"
        name="acquisitionDate"
        defaultValue={defaultValues.acquisitionDate}
        label="Acquisition Date"
        variant="outlined"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          defaultValue={defaultValues.status}
          label="Status"
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* The organizationId field is hidden and typically does not need a Material-UI component */}
      <input
        type="hidden"
        name="organizationId"
        value={defaultValues.organizationId}
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default AssetForm;
