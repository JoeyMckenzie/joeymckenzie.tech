import { ViewsApiResponse } from '@/lib/types/shared.types';
import {
  catchError,
  EMPTY,
  exhaustMap,
  firstValueFrom,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { mutate } from 'swr';

export function getBlogViews(key: string) {
  const $blogViews = fromFetch<ViewsApiResponse>(key, {
    selector: (response) => response.json(),
  }).pipe(
    map((data) => (isNaN(+data.total) ? 0 : +data.total)),
    catchError((error) => {
      console.error(error);
      return of(0);
    })
  );

  return firstValueFrom($blogViews);
}

export function addViewToBlog(apiLink: string, blogViews: number) {
  const $updatedViews = from(
    mutate<number>(apiLink, blogViews + 1, false)
  ).pipe(
    exhaustMap(() => fromFetch(apiLink, { method: 'POST' })),
    switchMap(() => from(mutate(apiLink))),
    catchError((error) => {
      console.error(error);
      return EMPTY;
    })
  );

  return firstValueFrom($updatedViews);
}
