import { catchError, EMPTY, firstValueFrom, map, tap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { TweetMeta, TwitterTimelineMeta } from '../types/twitter.types';

export function getTimeline() {
  const $timeline = fromFetch<TwitterTimelineMeta>('/api/twitter/timeline', {
    method: 'GET',
    selector: (response) => response.json(),
  }).pipe(
    catchError((error) => {
      console.log(error);
      return EMPTY;
    })
  );

  return firstValueFrom($timeline);
}
