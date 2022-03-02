import { ViewsApiResponse } from '@/lib/types';
import {
  catchError,
  EMPTY,
  exhaustMap,
  firstValueFrom,
  from,
  map,
  of,
  switchMap,
  timeout,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { mutate } from 'swr';

const TIMEOUT = 3000;

export function getBlogViews(key: string) {
  return firstValueFrom(
    fromFetch(key).pipe(
      timeout(TIMEOUT),
      exhaustMap((response) => from(response.json())),
      map((data: ViewsApiResponse) => (isNaN(+data.total) ? 0 : +data.total)),
      catchError((error) => {
        console.error(error);
        return of(0);
      })
    )
  );
}

export function addViewToBlog(apiLink: string, blogViews: number) {
  return firstValueFrom(
    from(mutate<number>(apiLink, blogViews + 1, false)).pipe(
      timeout(TIMEOUT),
      switchMap(() => fromFetch(apiLink, { method: 'POST' })),
      switchMap(() => from(mutate(apiLink))),
      catchError((error) => {
        console.error(error);
        return EMPTY;
      })
    )
  );
}
