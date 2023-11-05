import type { PageServerLoad } from './$types';
import { loadPostPreviews } from '$lib/loaders';

export const load: PageServerLoad = ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'max-age=604800',
  });
  return loadPostPreviews();
};
