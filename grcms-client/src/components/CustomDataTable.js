import * as React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Paper,
  TablePagination
} from "@mui/material";

const CustomDataTable = ({ columns, data, onSelectRow, selectedRow }) => {
  const calculateDisposalDate = (acquisitionDate, retentionPeriod) => {
    const acquisition = new Date(acquisitionDate);
    acquisition.setMonth(acquisition.getMonth() + retentionPeriod);
    return acquisition.toLocaleDateString();
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer  sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel>{column.label}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                selected={selectedRow === row.id}
                onClick={() => onSelectRow(row)}
                hover
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "dateOfDisposal"
                      ? calculateDisposalDate(
                          row["acquisitionDate"],
                          row["retentionPeriod"]
                        )
                      : column.id === "acquisitionDate"
                      ? new Date(row[column.id]).toLocaleDateString()
                      : column.id === "financialValue"
                      ? `${row[column.id]} ₾`
                      : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomDataTable;
