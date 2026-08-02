<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Http\Controllers\Admin\PostController;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(PostController::class)]
#[UsesClass(Post::class)]
#[UsesClass(Tag::class)]
#[UsesClass(User::class)]
final class PostIndexTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function guests_are_redirected_to_the_login_page(): void
    {
        $post = Post::factory()->published()->create();

        $this->get(route('admin.posts.index'))->assertRedirect(route('login'));
        $this->get(route('admin.posts.create'))->assertRedirect(route('login'));
        $this->get(route('admin.posts.edit', ['post' => $post->id]))->assertRedirect(route('login'));
    }

    #[Test]
    public function it_renders_every_post_catalog_field_for_an_authenticated_user(): void
    {
        $this->freezeTime();

        $tag = Tag::factory()->create(['name' => 'Laravel']);
        $post = Post::factory()->published()->for($tag)->create([
            'title' => 'A catalogued story',
            'slug' => 'a-catalogued-story',
            'reading_time_minutes' => 7,
            'views_count' => 42,
            'published_at' => now()->subDay(),
            'updated_at' => now()->subHour(),
        ]);

        $this->actingAs(User::factory()->create())
            ->get(route('admin.posts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component('admin/posts/index')
                ->has('posts', 1)
                ->where('posts.0.id', $post->id)
                ->where('posts.0.title', 'A catalogued story')
                ->where('posts.0.slug', 'a-catalogued-story')
                ->where('posts.0.tag', 'Laravel')
                ->where('posts.0.status', 'published')
                ->where('posts.0.publishedLabel', now()->subDay()->format('M d, Y'))
                ->where('posts.0.readingMinutes', 7)
                ->where('posts.0.views', 42)
                ->where('posts.0.updatedLabel', '1 hour ago'));
    }

    #[Test]
    public function it_lists_drafts_and_scheduled_posts_alongside_published_ones(): void
    {
        $this->freezeTime();

        $draft = Post::factory()->draft()->create(['updated_at' => now()]);
        $scheduled = Post::factory()->scheduled()->create(['updated_at' => now()->subHour()]);
        $published = Post::factory()->published()->create(['updated_at' => now()->subDay()]);

        $this->actingAs(User::factory()->create())
            ->get(route('admin.posts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component('admin/posts/index')
                ->has('posts', 3)
                ->where('posts.0.id', $draft->id)
                ->where('posts.0.status', 'draft')
                ->where('posts.1.id', $scheduled->id)
                ->where('posts.1.status', 'scheduled')
                ->where('posts.2.id', $published->id)
                ->where('posts.2.status', 'published'));
    }

    #[Test]
    public function it_renders_the_edit_page_for_a_draft_post(): void
    {
        $post = Post::factory()->draft()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('admin.posts.edit', ['post' => $post->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component('admin/posts/edit')
                ->where('post.id', $post->id)
                ->where('post.status', 'draft')
                ->where('post.publishedAt', null)
                ->has('tags', 1));
    }
}
