<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\PostStatus;
use App\Enums\Reaction;
use App\Http\Controllers\Admin\PostController;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Post;
use App\Models\PostReaction;
use App\Models\PostView;
use App\Models\Tag;
use App\Models\User;
use App\Support\ReadingTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(PostController::class)]
#[UsesClass(PostRequest::class)]
#[UsesClass(PostStatus::class)]
#[UsesClass(Post::class)]
#[UsesClass(PostReaction::class)]
#[UsesClass(PostView::class)]
#[UsesClass(ReadingTime::class)]
#[UsesClass(User::class)]
final class PostUpdateTest extends TestCase
{
    use RefreshDatabase;

    private const string CONTENT = "# Rewritten\n\nA **much** better body than before.";

    #[Test]
    public function it_updates_the_editable_fields_and_rederives_the_html_and_reading_estimate(): void
    {
        $post = Post::factory()->published()->create([
            'content_html' => '<p>stale markup</p>',
            'reading_time_minutes' => 99,
        ]);
        $tag = Tag::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'title' => 'A Better Title',
                'description' => 'A better description.',
                'tag_id' => $tag->id,
                'content' => self::CONTENT,
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.posts.edit', ['post' => $post->id]));

        $updated = $this->fresh($post);

        $this->assertSame('A Better Title', $updated->title);
        $this->assertSame('A better description.', $updated->description);
        $this->assertSame($tag->id, $updated->tag_id);
        $this->assertSame(self::CONTENT, $updated->content);
        $this->assertNotNull($updated->content_html);
        $this->assertStringNotContainsString('stale markup', $updated->content_html);
        $this->assertStringContainsString('<strong>', $updated->content_html);
        $this->assertSame(ReadingTime::forMarkdown(self::CONTENT), $updated->reading_time_minutes);
    }

    #[Test]
    public function a_post_may_keep_its_own_slug(): void
    {
        $post = Post::factory()->published()->create(['slug' => 'keep-me']);

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'title' => 'Same Slug, New Title',
            ]))
            ->assertSessionHasNoErrors();

        $this->assertSame('keep-me', $this->fresh($post)->slug);
    }

    #[Test]
    public function renaming_the_slug_does_not_orphan_views_or_reactions(): void
    {
        $post = Post::factory()->published()->create(['slug' => 'old-slug']);
        PostView::factory()->count(3)->for($post)->create();
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Fire]);
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Heart]);

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'slug' => 'new-slug',
            ]))
            ->assertSessionHasNoErrors();

        $updated = $this->fresh($post);

        $this->assertSame('new-slug', $updated->slug);
        $this->assertSame(3, $updated->views()->count());
        $this->assertSame(2, $updated->reactions()->count());
        $this->assertSame(3, PostView::query()->where('post_id', $post->id)->count());
        $this->assertSame(2, PostReaction::query()->where('post_id', $post->id)->count());
    }

    #[Test]
    public function it_rejects_another_posts_slug(): void
    {
        $post = Post::factory()->published()->create(['slug' => 'mine']);
        Post::factory()->published()->create(['slug' => 'theirs']);

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'slug' => 'theirs',
            ]))
            ->assertSessionHasErrors('slug');

        $this->assertSame('mine', $this->fresh($post)->slug);
    }

    #[Test]
    public function a_draft_can_be_published(): void
    {
        $this->freezeTime();
        $post = Post::factory()->draft()->create();

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'status' => PostStatus::Published->value,
            ]))
            ->assertSessionHasNoErrors();

        $publishedAt = $this->fresh($post)->published_at;

        $this->assertNotNull($publishedAt);
        $this->assertSame(now()->toDateTimeString(), $publishedAt->toDateTimeString());
    }

    #[Test]
    public function a_published_post_can_be_returned_to_draft(): void
    {
        $post = Post::factory()->published()->create();

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'status' => PostStatus::Draft->value,
            ]))
            ->assertSessionHasNoErrors();

        $this->assertNull($this->fresh($post)->published_at);
    }

    #[Test]
    public function a_draft_can_be_scheduled(): void
    {
        $this->freezeTime();
        $post = Post::factory()->draft()->create();
        $goLive = now()->addWeek();

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'status' => PostStatus::Scheduled->value,
                'published_at' => $goLive->format('Y-m-d H:i:s'),
            ]))
            ->assertSessionHasNoErrors();

        $publishedAt = $this->fresh($post)->published_at;

        $this->assertNotNull($publishedAt);
        $this->assertSame($goLive->toDateTimeString(), $publishedAt->toDateTimeString());
    }

    #[Test]
    public function republishing_a_live_post_keeps_its_original_publish_date(): void
    {
        $this->freezeTime();
        $originallyPublishedAt = now()->subDays(30);
        $post = Post::factory()->create(['published_at' => $originallyPublishedAt]);

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'status' => PostStatus::Published->value,
                'title' => 'Fixed A Typo',
            ]))
            ->assertSessionHasNoErrors();

        $publishedAt = $this->fresh($post)->published_at;

        $this->assertNotNull($publishedAt);
        $this->assertSame($originallyPublishedAt->toDateTimeString(), $publishedAt->toDateTimeString());
    }

    #[Test]
    public function publishing_a_scheduled_post_brings_it_forward_to_now(): void
    {
        $this->freezeTime();
        $post = Post::factory()->create(['published_at' => now()->addWeek()]);

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'status' => PostStatus::Published->value,
            ]))
            ->assertSessionHasNoErrors();

        $publishedAt = $this->fresh($post)->published_at;

        $this->assertNotNull($publishedAt);
        $this->assertSame(now()->toDateTimeString(), $publishedAt->toDateTimeString());
    }

    /**
     * The PATCH side of the same browser-submits-strings problem as the store test:
     * `tag_id` arrives as "1", and `PostRequest` casts it before anything reads it.
     */
    #[Test]
    public function it_accepts_a_string_tag_id_the_way_a_browser_form_submits_it(): void
    {
        $post = Post::factory()->published()->create();
        $tag = Tag::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'tag_id' => (string) $tag->id,
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.posts.edit', ['post' => $post->id]));

        $this->assertSame($tag->id, $this->fresh($post)->tag_id);
    }

    /**
     * Reload past the guest scope so drafts and scheduled posts resolve too.
     */
    private function fresh(Post $post): Post
    {
        return Post::query()->withoutGlobalScopes()->findOrFail($post->id);
    }

    /**
     * The form's full payload for an existing post, before any deliberate change.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(Post $post, array $overrides = []): array
    {
        return [
            'title' => $post->title,
            'slug' => $post->slug,
            'description' => $post->description,
            'tag_id' => $post->tag_id,
            'content' => $post->content,
            'status' => PostStatus::fromPublishedAt($post->published_at)->value,
            ...$overrides,
        ];
    }
}
