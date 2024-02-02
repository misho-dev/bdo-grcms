import React from 'react';

const FilterForm = ({ filters, setFilters }) => {
    return (
        <form>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    type="text"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
            </div>
            <div>
                <label htmlFor="type">Type:</label>
                <input
                    id="type"
                    type="text"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                />
            </div>
            {/* Include any additional filters here */}
        </form>
    );
};

export default FilterForm;
