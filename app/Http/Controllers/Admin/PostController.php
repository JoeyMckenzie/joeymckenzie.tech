<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\PostStatus;
use App\Http\Controllers\Concerns\HasCoverUrl;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Services\ImageProcessor;
use App\Services\MarkdownRenderer;
use App\Support\BlogCache;
use App\Support\ReadingTime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Post management for the single operator. Authorization is the route's
 * auth + verified middleware; see docs/adr/0003.
 */
final class PostController extends Controller
{
    use HasCoverUrl;

    public function __construct(
        private readonly MarkdownRenderer $renderer,
        private readonly ImageProcessor $images,
    ) {
        //
    }

    /**
     * Drafts and scheduled posts are visible here because Post's `visibleToGuest`
     * global scope only narrows to published for guests.
     */
    public function index(): Response
    {
        $posts = Post::query()
            ->select([
                'id',
                'tag_id',
                'title',
                'slug',
                'reading_time_minutes',
                'published_at',
                'views_count',
                'updated_at',
            ])
            ->with('tag:id,name')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Post $post): array => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'tag' => $post->tag->name,
                'status' => PostStatus::fromPublishedAt($post->published_at)->value,
                'publishedLabel' => $post->published_at?->format('M d, Y'),
                'readingMinutes' => $post->reading_time_minutes,
                'views' => $post->views_count,
                'updatedLabel' => $post->updated_at?->diffForHumans(),
            ]);

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'tags' => $this->tagOptions(),
        ]);
    }

    public function store(PostRequest $request): RedirectResponse
    {
        $post = new Post;

        $this->fill($post, $request);

        $post->save();

        BlogCache::forgetRecentPosts();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Post created.'),
        ]);

        return to_route('admin.posts.edit', ['post' => $post->id]);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'description' => $post->description,
                'tagId' => $post->tag_id,
                'content' => $post->content,
                'cover' => $this->coverUrl($post->image),
                'status' => PostStatus::fromPublishedAt($post->published_at)->value,
                'publishedAt' => $post->published_at?->format('Y-m-d\TH:i'),
                'views' => $post->views_count,
            ],
            'tags' => $this->tagOptions(),
        ]);
    }

    public function update(PostRequest $request, Post $post): RedirectResponse
    {
        $this->fill($post, $request);

        $post->save();

        BlogCache::forgetRecentPosts();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Post updated.'),
        ]);

        return to_route('admin.posts.edit', ['post' => $post->id]);
    }

    /**
     * Views and reactions are removed by their `cascadeOnDelete` foreign keys.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        BlogCache::forgetRecentPosts();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Post deleted.'),
        ]);

        return to_route('admin.posts.index');
    }

    /**
     * Apply a validated payload to a post, deriving everything the admin does not
     * type: the rendered HTML, the reading estimate, the publish timestamp, and
     * the cover key once a new file is uploaded.
     */
    private function fill(Post $post, PostRequest $request): void
    {
        $validated = $request->validated();
        $content = Arr::string($validated, 'content');

        $post->title = Arr::string($validated, 'title');
        $post->slug = Arr::string($validated, 'slug');
        $post->description = Arr::string($validated, 'description');
        $post->tag_id = $this->tagId($validated);
        $post->content = $content;
        $post->content_html = $this->renderer->render($content);
        $post->reading_time_minutes = ReadingTime::forMarkdown($content);
        $post->published_at = $request->status()->publishedAt(
            $post->published_at,
            $request->scheduledFor(),
        );

        $cover = $request->file('cover');

        if ($cover instanceof UploadedFile) {
            $post->image = $this->images->store($cover, $post->slug, 'cover')['key'];
        }
    }

    /**
     * Reuse the selected tag or create the normalized inline name.
     *
     * @param  array<string, mixed>  $validated
     */
    private function tagId(array $validated): int
    {
        if (isset($validated['tag_id'])) {
            return Arr::integer($validated, 'tag_id');
        }

        return Tag::query()->firstOrCreate([
            'name' => Arr::string($validated, 'tag_name'),
        ])->id;
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function tagOptions(): array
    {
        return Tag::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Tag $tag): array => [
                'id' => $tag->id,
                'name' => $tag->name,
            ])
            ->values()
            ->all();
    }
}
