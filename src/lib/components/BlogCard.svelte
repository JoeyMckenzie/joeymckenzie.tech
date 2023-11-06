<script lang="ts">
  import { format } from 'date-fns';
  import { Badge } from '$lib/components/ui/badge';
  import type { PostWithViewCount } from '$lib/types';

  // export let post: Post & { viewCount: number };
  export let post: PostWithViewCount;
</script>

<article
  class="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1"
>
  <a href={post.url}>
    <div class="flex items-center gap-x-4 text-xs">
      <time dateTime={post.pubDate}>
        {format(new Date(post.pubDate), 'PP')}
      </time>
      <Badge>{post.category}</Badge>
      <div class="font-medium text-neutral-400">{post.viewCount} views</div>
    </div>
    <div class="group relative">
      <h3 class="mt-3 text-lg font-semibold leading-6">
        <span class="absolute inset-0" />
        {post.title}
      </h3>
      <p class="mt-5 line-clamp-3 text-sm leading-6">
        {post.description}
      </p>
    </div>
  </a>
</article>
