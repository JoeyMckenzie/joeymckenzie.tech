<?php

declare(strict_types=1);

namespace Tests\Feature\Models;

use App\Models\Post;
use App\Models\PostReaction;
use App\Models\PostView;
use App\Models\Tag;
use App\Models\User;
use App\Reaction;
use Database\Seeders\TagSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(Post::class)]
#[CoversClass(PostReaction::class)]
#[CoversClass(PostView::class)]
#[CoversClass(Tag::class)]
#[CoversClass(Reaction::class)]
#[UsesClass(TagSeeder::class)]
#[UsesClass(User::class)]
final class BlogModelsTest extends TestCase
{
    use LazilyRefreshDatabase;

    #[Test]
    public function guests_only_see_published_posts(): void
    {
        $published = Post::factory()->published()->create();
        Post::factory()->draft()->create();
        Post::factory()->scheduled()->create();

        $visiblePostIds = Post::query()->pluck('id')->all();

        $this->assertSame([$published->id], $visiblePostIds);
    }

    #[Test]
    public function authenticated_author_sees_every_post_and_can_still_query_published_posts(): void
    {
        $published = Post::factory()->published()->create();
        $draft = Post::factory()->draft()->create();
        $scheduled = Post::factory()->scheduled()->create();

        $this->actingAs(User::factory()->create());

        $this->assertEqualsCanonicalizing(
            [$published->id, $draft->id, $scheduled->id],
            Post::query()->pluck('id')->all(),
        );
        $this->assertSame([$published->id], Post::published()->pluck('id')->all());
    }

    #[Test]
    public function factories_create_valid_related_models(): void
    {
        $tag = Tag::factory()->create();
        $post = Post::factory()->for($tag)->published()->create();
        $view = PostView::factory()->for($post)->create();
        $reaction = PostReaction::factory()->for($post)->create([
            'reaction' => Reaction::MindBlown,
        ]);

        $this->assertModelExists($tag);
        $this->assertModelExists($post);
        $this->assertModelExists($view);
        $this->assertModelExists($reaction);
        $this->assertTrue($post->tag->is($tag));
        $this->assertTrue($view->post->is($post));
        $this->assertTrue($reaction->post->is($post));
        $this->assertSame(Reaction::MindBlown, $reaction->reaction);
        $this->assertSame($post->slug, $post->getRouteKey());
        $this->assertSame($post->published_at?->format('M d, Y'), $post->formatted_published_at);

        $post->delete();

        $this->assertModelMissing($view);
        $this->assertModelMissing($reaction);
    }

    #[Test]
    public function tag_seeder_creates_the_known_tags_idempotently(): void
    {
        $this->seed(TagSeeder::class);
        $this->seed(TagSeeder::class);

        $this->assertSame([
            'laravel',
            'php',
            'dotnet',
            'angular',
            'astro',
            'design',
            'react',
            'rust',
            'zig',
        ], Tag::query()->orderBy('id')->pluck('name')->all());
    }
}
