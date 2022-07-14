import { catchError, EMPTY, firstValueFrom, map } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { LatestVideosResponse } from '../types/youtube.types';

export function fetchPlaylist() {
  const videos$ = fromFetch<LatestVideosResponse>('/api/youtube/latest', {
    method: 'GET',
    selector: (response) => response.json(),
  }).pipe(
    map((response) => response.videos),
    catchError((error) => {
      console.error(error);
      return EMPTY;
    })
  );

  return firstValueFrom(videos$);
}
