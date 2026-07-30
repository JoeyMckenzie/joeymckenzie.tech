<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class BlogController extends Controller
{
    /**
     * List published posts for the public blog index.
     *
     * Guests see published posts only; the authenticated author also sees
     * drafts and future-dated posts (via the Post `visibleToGuest` global
     * scope). Heavy content columns are never selected. Supports a `tag` name
     * filter and a `search` LIKE over title + description.
     *
     * View tracking, the show endpoint, and feature tests belong to JOEY-8.
     */
    public function index(Request $request): Response
    {
        $tagInput = $request->string('tag')->trim()->toString();
        $tag = $tagInput === '' ? null : $tagInput;

        $searchInput = $request->string('search')->trim()->toString();
        $search = $searchInput === '' ? null : $searchInput;

        $posts = Post::query()
            ->select([
                'id',
                'tag_id',
                'slug',
                'title',
                'description',
                'image',
                'reading_time_minutes',
                'published_at',
                'views_count',
            ])
            ->with('tag:id,name')
            ->when($tag !== null, function (Builder $query) use ($tag): void {
                $query->whereHas('tag', function (Builder $tagQuery) use ($tag): void {
                    $tagQuery->where('name', $tag);
                });
            })
            ->when($search !== null, function (Builder $query) use ($search): void {
                $query->where(function (Builder $group) use ($search): void {
                    $group
                        ->where('title', 'like', '%'.$search.'%')
                        ->orWhere('description', 'like', '%'.$search.'%');
                });
            })
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (Post $post): array => [
                'title' => $post->title,
                'slug' => $post->slug,
                'description' => $post->description,
                'tag' => $post->tag->name,
                // Seeded images are storage keys, not URLs — fall back to the
                // coverless plate until real R2 covers land (ADR 0002).
                'cover' => str_starts_with($post->image, 'http') ? $post->image : null,
                'publishedAt' => $post->published_at?->toDateString() ?? '',
                'publishedLabel' => $post->formatted_published_at,
                'readingMinutes' => $post->reading_time_minutes,
                'views' => $post->views_count,
            ]);

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'tags' => Tag::query()->whereHas('posts')->orderBy('name')->pluck('name'),
            'filters' => [
                'tag' => $tag,
                'search' => $search,
            ],
        ]);
    }
}
