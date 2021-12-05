import { ApiSort, LaunchResponse } from './Types';

export function getLaunches(page: number, limit: number, sort: ApiSort): Promise<LaunchResponse> {
    return fetch("https://api.spacexdata.com/v5/launches/query", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          options: {
            limit: limit,
            page: page + 1, // spaceX 1 indexes their pages, but we are 0 indexing
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
