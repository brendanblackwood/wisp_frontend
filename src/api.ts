import { LaunchResponse } from './Types';

export function getLaunches(page: number, sort: string = ''): Promise<LaunchResponse> {
    return fetch("https://api.spacexdata.com/v5/launches/query", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          options: {
            limit: 3,
            page: page + 1,
            populate: [
                'rocket'
            ],
            sort: sort,
          },
      }),
    })
      .then(res => res.json())
      .then(data => data as LaunchResponse);
}
