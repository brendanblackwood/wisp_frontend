export type Rocket = {
  name: string;
};

export type Launch = {
  id: string;
  name: string;
  date_utc: string;
  rocket: Rocket;
  flight_number: string;
  details: string;
  presskit_url: string;
};

export type LaunchResponse = {
  docs: Array<Launch>;
};