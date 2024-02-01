import React from 'react';

const AssetForm = ({ onSubmit, defaultValues }) => {
    const levels = ['LOW', 'MEDIUM', 'HIGH'];
    const statusOptions = ['ACTIVE', 'INACTIVE', 'DISPOSED'];
    const typeOptions = ['PC', 'SERVER', 'DOCUMENT', 'PHYSICAL_ASSET', 'BUSINESS_PROCESS'];
    const lifeCycleStages = ['CREATION', 'UTILIZATION', 'MAINTENANCE', 'DISPOSAL'];

    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="name" defaultValue={defaultValues.name} placeholder="Name" required /><br />

            <select name="criticality" defaultValue={defaultValues.criticality}>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
            </select><br />

            <select name="confidentiality" defaultValue={defaultValues.confidentiality}>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
            </select><br />

            <select name="availability" defaultValue={defaultValues.availability}>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
            </select><br />

            <select name="integrity" defaultValue={defaultValues.integrity}>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
            </select><br />

            <input type="text" name="owner" defaultValue={defaultValues.owner} placeholder="Owner" /><br />
            <input type="text" name="location" defaultValue={defaultValues.location} placeholder="Location" /><br />
            <input type="text" name="department" defaultValue={defaultValues.department} placeholder="Department" /><br />

            <input type="number" name="retentionPeriod" defaultValue={defaultValues.retentionPeriod} placeholder="Retention Period (in seconds)" /><br />
            <input type="number" name="financialValue" defaultValue={defaultValues.financialValue} placeholder="Financial Value" /><br />

            <input type="date" name="acquisitionDate" defaultValue={defaultValues.acquisitionDate} /><br />

            <select name="status" defaultValue={defaultValues.status}>
                {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
            </select><br />

            <select name="type" defaultValue={defaultValues.type}>
                {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
            </select><br />

            <select name="currentLifeCycleStage" defaultValue={defaultValues.currentLifeCycleStage}>
                {lifeCycleStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
            </select><br />

            <input type="hidden" name="organizationId" value={defaultValues.organizationId} />

            <button type="submit">Submit</button>
        </form>
    );
};

export default AssetForm;
