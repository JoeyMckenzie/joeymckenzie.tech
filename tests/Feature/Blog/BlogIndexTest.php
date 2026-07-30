<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Http\Controllers\BlogController;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Covers the blog index slice built alongside JOEY-4.2. The show endpoint and
 * view-tracking behaviour (and their tests) belong to JOEY-8.
 */
#[CoversClass(BlogController::class)]
final class BlogIndexTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_published_posts_for_guests(): void
    {
        Post::factory()->count(3)->published()->create();

        $this->get(route('blog.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component('blog/index')
                ->has('posts', 3));
    }

    #[Test]
    public function it_hides_drafts_and_future_posts_from_guests(): void
    {
        Post::factory()->published()->create();
        Post::factory()->draft()->create();
        Post::factory()->scheduled()->create();

        $this->get(route('blog.index'))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page->has('posts', 1));
    }

    #[Test]
    public function it_shows_drafts_and_future_posts_to_the_authenticated_author(): void
    {
        Post::factory()->published()->create();
        Post::factory()->draft()->create();
        Post::factory()->scheduled()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('blog.index'))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page->has('posts', 3));
    }

    #[Test]
    public function it_filters_by_tag_name(): void
    {
        $rust = Tag::factory()->create(['name' => 'rust']);
        $php = Tag::factory()->create(['name' => 'php']);

        Post::factory()->count(2)->published()->for($rust)->create();
        Post::factory()->published()->for($php)->create();

        $this->get(route('blog.index', ['tag' => 'rust']))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page->has('posts', 2));
    }

    #[Test]
    public function it_searches_across_title_and_description(): void
    {
        Post::factory()->published()->create(['title' => 'Learning Zig', 'description' => 'memory management']);
        Post::factory()->published()->create(['title' => 'A PHP story', 'description' => 'all about zig internals']);
        Post::factory()->published()->create(['title' => 'Unrelated', 'description' => 'nothing to see']);

        $this->get(route('blog.index', ['search' => 'zig']))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page->has('posts', 2));
    }
}
