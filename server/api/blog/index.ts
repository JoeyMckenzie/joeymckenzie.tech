import { getPostPreviews } from '~~/server/utils/db';

export default defineEventHandler(async () => {
  return {
    posts: await getPostPreviews(),
  };
});
