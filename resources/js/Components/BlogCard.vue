<script lang="ts" setup>
import Badge from '@/Components/ui/badge/Badge.vue';
import { Link } from '@inertiajs/vue3';
</script>

<article
    class="hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1"
>
<Link :href="route('post')">
    <div class="flex items-center gap-x-4 text-xs">
        <time :datetime="post.pubDate">
            {format(new Date(post.pubDate), 'PP')}
        </time>
        <Badge>{post.category}</Badge>
        {#if post.viewCount > 0}
        <div class="font-medium text-neutral-400">{post.viewCount} views</div>
        {/if}
    </div>
    <div class="group relative">
        <h3 class="mt-3 text-lg font-semibold leading-6">
            <span class="absolute inset-0"/>
            {post.title}
        </h3>
        <p class="mt-5 line-clamp-3 text-sm leading-6">
            {post.description}
        </p>
    </div>
</Link>
</article>
