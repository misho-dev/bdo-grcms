import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';


const CustomDataTable = ({ columns, data, onSelectRow, selectedRow }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.id}>
                                <TableSortLabel>
                                    {column.label}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <TableRow 
                            key={row.id} 
                            selected={selectedRow === row.id}
                            onClick={() => onSelectRow(row)}
                            hover
                        >
                            {columns.map(column => (
                                <TableCell key={column.id}>
                                     {column.id === 'acquisitionDate' ? new Date(row[column.id]).toLocaleDateString() : 
                                    column.id === 'financialValue' ? `${row[column.id]} ₾` : row[column.id]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomDataTable;
