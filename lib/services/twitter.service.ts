import { catchError, EMPTY, firstValueFrom } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { TwitterTimelineMeta } from '../types/twitter.types';

export function getTimeline(url: string) {
  const timeline$ = fromFetch<TwitterTimelineMeta>(url, {
    method: 'GET',
    selector: (response) => response.json(),
  }).pipe(
    catchError((error) => {
      console.log(error);
      return EMPTY;
    })
  );

  return firstValueFrom(timeline$);
}
