export type Launch = {
  id: string;
  name: string;
  date_utc: string;
  rocket: string;
  flight_number: string;
  details: string;
};

export type LaunchResponse = {
  docs: Array<Launch>;
};