import { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getLaunches } from './api';
import { Launch } from './Types';

type Order = 'asc' | 'desc';

function Launches() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Launch[]>([]);
  const [count, setCount] = useState(0)
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Launch>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    getLaunches(page, rowsPerPage)
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
  }, [page, rowsPerPage]);

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
                <TableCell>Flight Number</TableCell>
                <TableCell align="right">Launch Year</TableCell>
                <TableCell align="right">Launch Name</TableCell>
                <TableCell align="right">Rocket Name</TableCell>
                <TableCell align="right">Details</TableCell>
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
                <TableCell component="th" scope="row">
                  {row.flight_number}
                </TableCell>
                <TableCell align="right">{(new Date(row.date_utc)).getFullYear()}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.rocket.name}</TableCell>
                <TableCell align="right">{row.details}</TableCell>
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