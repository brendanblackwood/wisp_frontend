import { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Launch, LaunchResponse } from './Types';

function Launches() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<Launch[]>([]);

  useEffect(() => {
    fetch("https://api.spacexdata.com/v4/launches/query", {
      method: 'POST',
      body: 'limit=2',
    })
      .then(res => res.json())
      .then(data => data as LaunchResponse)
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.docs);
        },
        (error) => {
          setIsLoaded(true);
          setError(error.message);
        }
      )
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.flight_number}
              </TableCell>
              <TableCell align="right">{row.date_utc}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.rocket}</TableCell>
              <TableCell align="right">{row.details}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
  
  export default Launches;