import React from 'react';
import { render } from '@testing-library/react';
import Launches from './Launches';
import { getLaunches } from './api';

jest.mock('./api', () => ({
  getLaunches: jest.fn(),
}));

// typecast getLaunches as a jest.Mock so typescripy doesn't get angry
const getLaunchesMock = getLaunches as jest.Mock;


test('renders error instead of table', async () => {
  getLaunchesMock.mockRejectedValue(new Error('This service is down for maintenance.'));

  const { findByText } = render(<Launches />);
  const element = await findByText(/This service is down for maintenance./i);
  expect(element).toBeInTheDocument();
});

test('renders empty table', async () => {
  getLaunchesMock.mockResolvedValue({docs: [], totalDocs: 0});

  const { findByText } = render(<Launches />);
  const element = await findByText(/No Launches Found/i);
  expect(element).toBeInTheDocument();
});

test('renders 2 rows', async () => {
  getLaunchesMock.mockResolvedValue({docs: [
    {
      id: '1',
      name: 'First Launch',
      date_utc: '2021-11-05T23:05:03.946Z',
      rocket: {
        name: "Biggest Rocket Yet",
      },
      flight_number: '1',
      details: 'Definitely won\'t crash',
      links: {
        presskit: 'https://www.example.com',
      },
    },
    {
      id: '2',
      name: 'Second Launch',
      date_utc: '2021-12-05T23:05:03.946Z',
      rocket: {
        name: "Zoom Zoom",
      },
      flight_number: '2',
      details: 'We can reuse this one.',
      links: {
        presskit: 'https://www.example-two.com',
      },
    },
  ], totalDocs: 50});

  // check for first row
  const { findByText } = render(<Launches />);
  let element = await findByText(/First Launch/i);
  expect(element).toBeInTheDocument();

  // check for pagination
  element = await findByText(/of 50/)
  expect(element).toBeInTheDocument();
});
