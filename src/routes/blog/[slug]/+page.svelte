<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import type { PageServerData } from './$types';

  const { data } = $props<{ data: PageServerData }>();
  const markdownContent = $derived(data.post?.body?.html ?? '');
</script>

<svelte:head>
  <title>{data.post.title} | joeymckenzie.tech</title>
  <meta content={data.post.description} name="description" />
  {#if data.post.keywords && data.post.keywords.length > 0}
    <meta name="keywords" content={data.post.keywords.join(',')} />
  {/if}
</svelte:head>

<div class="flex flex-col justify-center">
  <article
    class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-img:mx-auto prose-img:rounded-md"
  >
    <h1 class="text-center text-2xl">{data.post.title}</h1>
    <div
      class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"
    >
      <time dateTime={new Date(data.post.pubDate ?? '')?.toISOString() ?? ''}>
        {new Date(data.post.pubDate ?? '').toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </time>
      <Badge>{data.post.category}</Badge>
    </div>
    <img
      height="400"
      width="500"
      alt={`${data.post.title} hero image`}
      src={data.post.heroImage}
    />
    <!-- eslint-disable-next-line  -->
    {@html markdownContent}
  </article>
  <Button class="mx-auto max-w-md">
    <a href="/blog">Back to blogs</a>
  </Button>
</div>
