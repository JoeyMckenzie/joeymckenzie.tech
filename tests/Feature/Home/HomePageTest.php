<?php

declare(strict_types=1);

namespace Tests\Feature\Home;

use App\Http\Controllers\HomeController;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(HomeController::class)]
final class HomePageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_renders_the_home_page_with_recent_published_posts(): void
    {
        Post::factory()->count(3)->published()->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->component('home')
                ->has('posts', 3));
    }

    #[Test]
    public function it_limits_recent_posts_to_three(): void
    {
        Post::factory()->count(5)->published()->create();

        $this->get(route('home'))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page->has('posts', 3));
    }

    #[Test]
    public function it_excludes_drafts_and_future_dated_posts(): void
    {
        Post::factory()->count(2)->published()->create();
        Post::factory()->draft()->create();
        Post::factory()->scheduled()->create();

        $this->get(route('home'))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page->has('posts', 2));
    }

    #[Test]
    public function it_orders_recent_posts_by_published_date_descending(): void
    {
        Post::factory()->published()->create([
            'title' => 'Oldest',
            'published_at' => now()->subDays(2),
        ]);
        Post::factory()->published()->create([
            'title' => 'Newest',
            'published_at' => now()->subDay(),
        ]);

        $this->get(route('home'))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->has('posts', 2)
                ->where('posts.0.title', 'Newest')
                ->where('posts.1.title', 'Oldest'));
    }

    #[Test]
    public function it_returns_the_expected_post_shape(): void
    {
        $tag = Tag::factory()->create(['name' => 'rust']);
        Post::factory()->published()->for($tag)->create([
            'title' => 'Test Post',
            'description' => 'A description',
            'slug' => 'test-post',
        ]);

        $this->get(route('home'))
            ->assertInertia(fn (Assert $page): AssertableInertia => $page
                ->has('posts', 1)
                ->where('posts.0.tag', 'rust')
                ->where('posts.0.title', 'Test Post')
                ->has('posts.0.cover')
                ->has('posts.0.publishedLabel')
                ->has('posts.0.readingMinutes')
                ->has('posts.0.views'));
    }
}
