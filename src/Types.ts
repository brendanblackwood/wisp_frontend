export type Launch = {
  id: string;
  name: string;
  date_utc: string;
  rocket: {
    name: string;
  };
  flight_number: string;
  details: string;
  links: {
    presskit: string,
  };
};

export type LaunchResponse = {
  docs: Array<Launch>;
  totalDocs: number;
};

export type ApiSortOrder = 'asc' | 'desc';

export interface ApiSort {
  [key: string]: ApiSortOrder;
};