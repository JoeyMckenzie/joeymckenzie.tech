<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\PostStatus;
use App\Http\Controllers\Admin\PostController;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Support\ReadingTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(PostController::class)]
#[UsesClass(PostRequest::class)]
#[UsesClass(PostStatus::class)]
#[UsesClass(Post::class)]
#[UsesClass(ReadingTime::class)]
#[UsesClass(User::class)]
final class PostStoreTest extends TestCase
{
    use RefreshDatabase;

    private const string CONTENT = "# Heading\n\nSome **bold** body text.";

    #[Test]
    public function it_creates_a_post_and_redirects_to_its_edit_page(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload())
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.posts.edit', ['post' => $this->storedPost()->id]));

        $this->assertDatabaseCount('posts', 1);
        $this->assertDatabaseHas('posts', [
            'title' => 'Writing Zig In Anger',
            'slug' => 'writing-zig-in-anger',
            'description' => 'A short note about comptime.',
            'content' => self::CONTENT,
        ]);
    }

    #[Test]
    public function it_derives_the_rendered_html_and_reading_estimate(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload())
            ->assertSessionHasNoErrors();

        $post = $this->storedPost();

        $this->assertNotNull($post->content_html);
        $this->assertStringContainsString('<h1', $post->content_html);
        $this->assertStringContainsString('<strong>', $post->content_html);
        $this->assertSame(ReadingTime::forMarkdown(self::CONTENT), $post->reading_time_minutes);
    }

    #[Test]
    public function it_derives_the_slug_from_the_title_when_none_is_typed(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload([
                'title' => 'My Fancy Post',
                'slug' => '',
            ]))
            ->assertSessionHasNoErrors();

        $this->assertSame('my-fancy-post', $this->storedPost()->slug);
    }

    #[Test]
    public function it_normalises_a_messy_slug(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['slug' => '  My Messy Slug  ']))
            ->assertSessionHasNoErrors();

        $this->assertSame('my-messy-slug', $this->storedPost()->slug);
    }

    #[Test]
    public function it_rejects_a_duplicate_slug(): void
    {
        Post::factory()->published()->create(['slug' => 'already-taken']);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['slug' => 'already-taken']))
            ->assertSessionHasErrors('slug');

        $this->assertDatabaseCount('posts', 1);
    }

    #[Test]
    public function a_draft_is_stored_without_a_publish_timestamp(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['status' => PostStatus::Draft->value]))
            ->assertSessionHasNoErrors();

        $this->assertNull($this->storedPost()->published_at);
    }

    #[Test]
    public function a_published_post_goes_live_no_later_than_now(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['status' => PostStatus::Published->value]))
            ->assertSessionHasNoErrors();

        $publishedAt = $this->storedPost()->published_at;

        $this->assertNotNull($publishedAt);
        $this->assertTrue($publishedAt->lessThanOrEqualTo(now()));
    }

    #[Test]
    public function a_scheduled_post_keeps_its_future_timestamp(): void
    {
        $this->freezeTime();
        $goLive = now()->addWeek();

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload([
                'status' => PostStatus::Scheduled->value,
                'published_at' => $goLive->format('Y-m-d H:i:s'),
            ]))
            ->assertSessionHasNoErrors();

        $publishedAt = $this->storedPost()->published_at;

        $this->assertNotNull($publishedAt);
        $this->assertSame($goLive->toDateTimeString(), $publishedAt->toDateTimeString());
    }

    #[Test]
    public function a_scheduled_post_requires_a_publish_timestamp(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['status' => PostStatus::Scheduled->value]))
            ->assertSessionHasErrors('published_at');

        $this->assertDatabaseCount('posts', 0);
    }

    #[Test]
    public function a_scheduled_post_cannot_be_dated_in_the_past(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload([
                'status' => PostStatus::Scheduled->value,
                'published_at' => now()->subDay()->format('Y-m-d H:i:s'),
            ]))
            ->assertSessionHasErrors('published_at');

        $this->assertDatabaseCount('posts', 0);
    }

    #[Test]
    public function it_stores_an_uploaded_cover_as_an_object_key(): void
    {
        $disk = Config::string('blog.image_disk');
        Storage::fake($disk, ['url' => 'https://images.test']);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload([
                'cover' => UploadedFile::fake()->image('cover.jpg', 1200, 630),
            ]))
            ->assertSessionHasNoErrors();

        $this->assertSame('posts/writing-zig-in-anger/cover.webp', $this->storedPost()->image);
        Storage::disk($disk)->assertExists('posts/writing-zig-in-anger/cover.webp');
    }

    #[Test]
    public function it_stores_a_post_with_no_cover_at_all(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload())
            ->assertSessionHasNoErrors();

        // `image` is only nullable because of the drafts-without-a-cover migration.
        $this->assertDatabaseHas('posts', [
            'slug' => 'writing-zig-in-anger',
            'image' => null,
        ]);
    }

    #[Test]
    public function it_requires_a_title(): void
    {
        $payload = $this->payload();
        unset($payload['title']);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $payload)
            ->assertSessionHasErrors('title');

        $this->assertDatabaseCount('posts', 0);
    }

    #[Test]
    public function it_requires_content(): void
    {
        $payload = $this->payload();
        unset($payload['content']);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $payload)
            ->assertSessionHasErrors('content');

        $this->assertDatabaseCount('posts', 0);
    }

    #[Test]
    public function it_requires_a_tag_that_exists(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['tag_id' => 9999]))
            ->assertSessionHasErrors('tag_id');

        $this->assertDatabaseCount('posts', 0);
    }

    /**
     * A browser submits every field as a string, so `tag_id` arrives as "1" rather
     * than 1. Every other test here posts a real int, which is exactly why this
     * regressed once already. `PostRequest` normalises it for both store and update.
     */
    #[Test]
    public function it_accepts_a_string_tag_id_the_way_a_browser_form_submits_it(): void
    {
        $tag = Tag::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.store'), $this->payload(['tag_id' => (string) $tag->id]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.posts.edit', ['post' => $this->storedPost()->id]));

        $this->assertSame($tag->id, $this->storedPost()->tag_id);
    }

    /**
     * The single post the request under test created, read past the guest scope.
     */
    private function storedPost(): Post
    {
        return Post::query()->withoutGlobalScopes()->latest('id')->firstOrFail();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return [
            'title' => 'Writing Zig In Anger',
            'slug' => 'writing-zig-in-anger',
            'description' => 'A short note about comptime.',
            'tag_id' => Tag::factory()->create()->id,
            'content' => self::CONTENT,
            'status' => PostStatus::Draft->value,
            ...$overrides,
        ];
    }
}
