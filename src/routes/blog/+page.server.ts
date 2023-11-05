import type { PageServerLoad } from './$types';
import { loadPostPreviews } from '$lib/loaders';

export const load: PageServerLoad = ({}) => loadPostPreviews();
