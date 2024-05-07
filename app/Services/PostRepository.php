<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ContentRepositoryContract;
use App\Models\Keyword;
use App\Models\Post;
use App\ValueObjects\ContentMeta;
use Carbon\Carbon;
use DateInterval;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Override;

final readonly class PostRepository implements ContentRepositoryContract
{
    private const string POSTS_CACHE_KEY = 'allPosts';

    #[Override]
    public function getBlogPostBySlug(string $slug): Post
    {
        // We won't cache the blogs, easier to let the view counts ride
        $post = Post::query()
            ->with('keywords')
            ->select([
                'id',
                'slug',
                'hero_image',
                'published_date',
                'category',
                'title',
                'parsed_content',
                'views',
            ])->firstWhere('slug', $slug);

        if ($post === null) {
            abort(404);
        }

        $post->views += 1;
        $post->save();

        return $post;
    }

    #[Override]
    public function getLatestBlogPostMetadata(): Collection
    {
        /** @var Collection<int, Post> $posts */
        $posts = self::getBlogPostMetadata()
            ->sortByDesc('published_date')
            ->take(3);

        return $posts;
    }

    #[Override]
    public function getBlogPostMetadata(): Collection
    {
        if (Cache::has(self::POSTS_CACHE_KEY)) {
            /** @var Collection<int, Post> $allPosts */
            $allPosts = Cache::get(self::POSTS_CACHE_KEY);

            return $allPosts;
        }

        $posts = Post::select([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ])
            ->orderByDesc('published_date')
            ->get();

        Cache::set(self::POSTS_CACHE_KEY, $posts, new DateInterval('PT5M'));

        return $posts;
    }

    #[Override]
    public function upsertBlogPost(ContentMeta $contentMeta): Post
    {
        $contentSlug = $contentMeta->slug;

        Log::info("upserting blog post $contentSlug");

        $upsertedBlog = Post::updateOrCreate([
            'slug' => $contentSlug,
        ], [
            'slug' => $contentSlug,
            'title' => $contentMeta->frontMatter->data['title'],
            'description' => $contentMeta->frontMatter->data['description'],
            'category' => $contentMeta->frontMatter->data['category'],
            'published_date' => Carbon::parse($contentMeta->frontMatter->data['pubDate']),
            'hero_image' => $contentMeta->frontMatter->data['heroImage'],
            'raw_content' => $contentMeta->markdown,
            'parsed_content' => $contentMeta->html,
        ]);

        foreach ($contentMeta->frontMatter->data['keywords'] as $keyword) {
            $keyword = Keyword::firstOrCreate(['word' => strtolower($keyword)]);
            $upsertedBlog->keywords()->firstOrCreate(['word' => $keyword->word]);
        }

        Log::info('blog content updated!');

        return $upsertedBlog;
    }
}
