<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasCoverUrl;
use App\Models\Post;
use App\Models\Tag;
use App\Support\VisitorHash;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class BlogController extends Controller
{
    use HasCoverUrl;

    public function index(Request $request): Response
    {
        $tagInput = $request->string('tag')->trim()->toString();
        $tag = blank($tagInput) ? null : $tagInput;
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
            ->when($tag !== null, static function (Builder $query) use ($tag): void {
                $query->whereHas('tag', static function (Builder $tagQuery) use ($tag): void {
                    $tagQuery->where('name', $tag);
                });
            })
            ->when($search !== null, static function (Builder $query) use ($search): void {
                $query->where(static function (Builder $group) use ($search): void {
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
                'cover' => $this->coverUrl($post->image),
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

    public function show(Request $request, Post $post): Response
    {
        $this->recordView($request, $post);

        $post->loadMissing('tag:id,name');

        return Inertia::render('blog/show', [
            'post' => [
                'title' => $post->title,
                'slug' => $post->slug,
                'description' => $post->description,
                'tag' => $post->tag->name,
                'cover' => $this->coverUrl($post->image),
                'contentHtml' => $post->content_html ?? '',
                'publishedAt' => $post->published_at?->toDateString() ?? '',
                'publishedLabel' => $post->formatted_published_at,
                'readingMinutes' => $post->reading_time_minutes,
                'views' => $post->views_count,
            ],
        ]);
    }

    private function recordView(Request $request, Post $post): void
    {
        if (! Auth::guest()) {
            return;
        }

        $ipHash = VisitorHash::for($request);
        $alreadyViewed = $post->views()
            ->where('ip_hash', $ipHash)
            ->where('viewed_at', '>=', now()->subDay())
            ->exists();

        if ($alreadyViewed) {
            return;
        }

        $post->views()->create([
            'ip_hash' => $ipHash,
            'referrer' => $request->headers->get('referer'),
            'user_agent' => $request->userAgent(),
            'viewed_at' => now(),
        ]);

        $post->increment('views_count');
    }
}
