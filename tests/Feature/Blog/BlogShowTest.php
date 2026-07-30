<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Http\Controllers\BlogController;
use App\Models\Post;
use App\Models\PostView;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(BlogController::class)]
final class BlogShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_shows_a_published_post_with_its_rendered_html(): void
    {
        $post = Post::factory()->published()->create([
            'content_html' => '<p>hello nocturne</p>',
        ]);

        $this->get(route('blog.show', $post))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('blog/show')
                ->where('post.slug', $post->slug)
                ->where('post.contentHtml', '<p>hello nocturne</p>'));
    }

    #[Test]
    public function a_guest_visit_records_a_view_and_increments_the_count(): void
    {
        $post = Post::factory()->published()->create(['views_count' => 0]);

        $this->get(route('blog.show', $post))->assertOk();

        $this->assertSame(1, $post->refresh()->views_count);
        $this->assertDatabaseCount('post_views', 1);
    }

    #[Test]
    public function repeated_guest_visits_within_24h_are_deduped(): void
    {
        $post = Post::factory()->published()->create(['views_count' => 0]);

        $this->get(route('blog.show', $post))->assertOk();
        $this->get(route('blog.show', $post))->assertOk();

        $this->assertSame(1, $post->refresh()->views_count);
        $this->assertDatabaseCount('post_views', 1);
    }

    #[Test]
    public function a_visit_after_the_24h_window_counts_again(): void
    {
        $post = Post::factory()->published()->create(['views_count' => 1]);

        // An earlier view from this client, now outside the rolling 24h window.
        PostView::factory()->for($post)->create([
            'ip_hash' => hash('xxh128', Config::string('app.key').'|127.0.0.1'),
            'viewed_at' => now()->subDay()->subMinute(),
        ]);

        $this->get(route('blog.show', $post))->assertOk();

        $this->assertSame(2, $post->refresh()->views_count);
        $this->assertDatabaseCount('post_views', 2);
    }

    #[Test]
    public function the_authenticated_author_does_not_record_a_view(): void
    {
        $post = Post::factory()->published()->create(['views_count' => 0]);

        $this->actingAs(User::factory()->create())
            ->get(route('blog.show', $post))
            ->assertOk();

        $this->assertSame(0, $post->refresh()->views_count);
        $this->assertDatabaseCount('post_views', 0);
    }

    #[Test]
    public function guests_cannot_see_drafts_or_future_posts_but_the_author_can(): void
    {
        $draft = Post::factory()->draft()->create();
        $scheduled = Post::factory()->scheduled()->create();

        $this->get(route('blog.show', $draft))->assertNotFound();
        $this->get(route('blog.show', $scheduled))->assertNotFound();

        $author = User::factory()->create();
        $this->actingAs($author)->get(route('blog.show', $draft))->assertOk();
        $this->actingAs($author)->get(route('blog.show', $scheduled))->assertOk();
    }
}
