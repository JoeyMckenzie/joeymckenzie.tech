import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { catchError, firstValueFrom, from, map, of, tap } from 'rxjs';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return response.status(405);
  }

  const client = google.youtube({
    version: 'v3',
  });

  const personalChannels$ = from(
    client.channels.list({
      part: ['contentDetails'],
      forUsername: 'JoeyMcKenzie',
      key: process.env.YOUTUBE_API_KEY,
    })
  ).pipe(
    tap((response) => console.log(response.data)),
    map((channels) =>
      response.status(200).json({
        channels,
      })
    ),
    catchError((error) => {
      console.error(error);
      return of(
        response.status(500).json({
          message: error.toString(),
        })
      );
    })
  );

  return firstValueFrom(personalChannels$);
}
