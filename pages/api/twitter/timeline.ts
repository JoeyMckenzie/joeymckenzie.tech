import {
  TwitterTimelineMetaResponse,
  TwitterTimelineResponse,
  TwitterTokenResponse,
} from '@/lib/types/twitter.types';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  catchError,
  firstValueFrom,
  map,
  of,
  switchMap,
  from,
  tap,
  filter,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Client, auth } from 'twitter-api-sdk';

const TIMELINE_URL = `https://api.twitter.com/2/users/${process.env.TWITTER_USER_ID}/tweets`;
const TOKEN_URL = `https://${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_SECRET}@api.twitter.com/oauth2/token?grant_type=client_credentials`;

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return response.status(405);
  }

  const test = new auth.OAuth2Bearer('test;');
  const client = new Client(test);

  if (process.env.TWITTER_API_ENABLED === 'true') {
    // const $timeline = (token: string) =>
    //   fromFetch<TwitterTimelineResponse>(TIMELINE_URL, {
    //     method: 'GET',
    //     selector: (timelineApiResponse) => timelineApiResponse.json(),
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).pipe(
    //     map((timelineResponse) => {
    //       // filter out tweets that are responses to other tweets, don't care about those for now
    //       const tweets = timelineResponse.data
    //         .map((tweetMeta) => tweetMeta.text)
    //         .filter((tweet) => tweet.charAt(0) !== '@');

    //       const meta: TwitterTimelineMetaResponse = {};

    //       return response.status(200).json({
    //         tweets,
    //       });
    //     })
    //   );

    const $timeline = (token: string) => {
      const authClient = new auth.OAuth2Bearer(token);
      const client = new Client(authClient);

      return from(
        client.tweets.usersIdTweets(process.env.TWITTER_USER_ID ?? '', {
          'tweet.fields': ['created_at', 'public_metrics'],
          'user.fields': ['username', 'profile_image_url'],
          expansions: ['author_id'],
        })
      ).pipe(
        filter((timelineResponse) => !!timelineResponse),
        map((timelineResponse) => {
          // filter out tweets that are responses to other tweets, don't care about those for now
          const tweets = timelineResponse
            .data!.map((tweetMeta) => ({
              text: tweetMeta.text,
              createdAt: tweetMeta.created_at ?? '',
            }))
            .filter(
              ({ text }) => text.charAt(0) !== '@' || text.indexOf('RT') < -1
            );

          const meta: TwitterTimelineMetaResponse = {
            tweets,
            profileMeta: {
              image:
                timelineResponse.includes!.users![0].profile_image_url ?? '',
              name: timelineResponse.includes!.users![0].name,
              username: timelineResponse.includes!.users![0].username,
            },
          };

          // return response.status(200).json(meta);
          return meta;
        })
      );

      return fromFetch<TwitterTimelineResponse>(TIMELINE_URL, {
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

          // const meta: TwitterTimelineMetaResponse = {};

          return response.status(200).json({
            tweets,
          });
        })
      );
    };

    const $authentication = fromFetch<TwitterTokenResponse>(TOKEN_URL, {
      method: 'POST',
      selector: (authenticationApiResponse) => authenticationApiResponse.json(),
    }).pipe(
      map((authenticationResponse) => authenticationResponse.access_token),
      switchMap($timeline),
      tap(console.log),
      map((meta) => response.status(200).json(meta)),
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
