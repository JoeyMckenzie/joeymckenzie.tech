import { catchError, EMPTY, firstValueFrom, tap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export function getTimeline() {
  const $timeline = fromFetch('/api/twitter/timeline', {
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
