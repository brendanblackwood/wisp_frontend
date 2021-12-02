import { useState, useEffect } from "react";
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
  }, [])

  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        <li>
          <span>Flight Number</span>
          <span>Launch Year</span>
          <span>Launch Name</span>
          <span>Rocket Name</span>
          <span>Details</span>
        </li>
        {items.map(item => (
          <li key={item.id}>
            <span>{item.flight_number}</span>
            <span>{item.date_utc}</span>
            <span>{item.name}</span>
            <span>{item.rocket}</span>
            <span>{item.details}</span>
          </li>
        ))}
      </ul>
    );
  }
}

export default Launches;