<script lang="ts">
  import type { PageServerData } from './$types';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';

  export let data: PageServerData;

  const content = data.post?.body?.html ?? '';
</script>

<svelte:head>
  <title>{data.post?.title} | joeymckenzie.tech</title>
</svelte:head>

<div class="flex flex-col justify-center">
  <article
    class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-img:mx-auto prose-img:rounded-md"
  >
    <h1 class="text-center text-2xl">{data.post?.title}</h1>
    <div
      class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"
    >
      <time dateTime={new Date(data.post?.pubDate ?? '').toISOString()}>
        {new Date(data.post?.pubDate ?? '').toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </time>
      <Badge>{data.post?.category}</Badge>
    </div>
    <img alt="Blog header" src={data.post?.heroImage} />
    <!-- eslint-disable-next-line  -->
    {@html content}
  </article>
  <Button class="mx-auto max-w-md">
    <a href="/blog">Back to blogs</a>
  </Button>
</div>
