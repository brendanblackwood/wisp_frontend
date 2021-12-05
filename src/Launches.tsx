import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';

import { getLaunches } from './api';
import { ApiSort, Launch } from './Types';

type Order = 'asc' | 'desc';

function Launches() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Launch[]>([]);
  const [count, setCount] = useState(0)
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Launch>('flight_number');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Launch) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    const sort: ApiSort = {
      [orderBy]: order,
    };
    getLaunches(page, rowsPerPage, sort)
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.docs);
          setCount(result.totalDocs)
        },
        (error) => {
          setIsLoaded(true);
          setError(error.message);
        }
      )
  }, [page, rowsPerPage, order, orderBy]);

  const columns: {
    label: string;
    key: keyof Launch;
    alignment: TableCellProps["align"];
  }[] = [
    {
      label: 'Flight Number',
      key: 'flight_number',
      alignment: 'left',
    },
    {
      label: 'Launch Year',
      key: 'date_utc',
      alignment: 'right',
    },
    {
      label: 'Launch Name',
      key: 'name',
      alignment: 'left',
    },
    {
      label: 'Rocket Name',
      key: 'rocket',
      alignment: 'left',
    },
    {
      label: 'Details',
      key: 'details',
      alignment: 'left',
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="spacex-launches">
            <TableHead>
              <TableRow>
              {columns.map((column) => (
                <TableCell
                  align={column.alignment}
                  key={column.key}
                  padding="normal"
                  sortDirection={orderBy === column.key ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : 'asc'}
                    onClick={() => handleRequestSort(column.key)}
                  >
                    {column.label}
                    {orderBy === column.key ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {items.map((row) => (
              <TableRow
                hover
                key={row.id}
                onClick={() => window.open(row.links.presskit, '_blank')}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left" component="th" scope="row">
                  {row.flight_number}
                </TableCell>
                <TableCell align="right">{(new Date(row.date_utc)).getFullYear()}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.rocket.name}</TableCell>
                <TableCell align="left" title={row.details} sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '300px',
                }}>{row.details}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
  }
}
  
  export default Launches;