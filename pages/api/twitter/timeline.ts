import {
  TwitterTimelineResponse,
  TwitterTokenResponse,
} from '@/lib/types/twitter.types';
import { NextApiRequest, NextApiResponse } from 'next';
import { catchError, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

const TIMELINE_URL = `https://api.twitter.com/2/users/${process.env.TWITTER_USER_ID}/tweets`;
const TOKEN_URL = `https://${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_SECRET}@api.twitter.com/oauth2/token?grant_type=client_credentials`;

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return response.status(405);
  }

  if (process.env.TWITTER_API_ENABLED === 'true') {
    const $timeline = (token: string) =>
      fromFetch<TwitterTimelineResponse>(TIMELINE_URL, {
        method: 'GET',
        selector: (timelineApiResponse) => timelineApiResponse.json(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).pipe(
        map((timelineResponse) => {
          // filter out tweets that are responses to other tweets, don't care about those for now
          const tweets = timelineResponse.data
            .map((tweetMeta) => tweetMeta.text)
            .filter((tweet) => tweet.charAt(0) !== '@');

          return response.status(200).json({
            tweets,
          });
        })
      );

    const $authentication = fromFetch<TwitterTokenResponse>(TOKEN_URL, {
      method: 'POST',
      selector: (authenticationApiResponse) => authenticationApiResponse.json(),
    }).pipe(
      map((authenticationResponse) => authenticationResponse.access_token),
      switchMap($timeline),
      catchError((error) => {
        console.error(error);
        return of(
          response.status(500).json({
            error: error.toString(),
          })
        );
      })
    );

    return firstValueFrom($authentication);
  }

  return response.status(200).json({
    message: 'timeline successful',
  });
}
