<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\Reaction;
use App\Http\Controllers\Admin\PostController;
use App\Models\Post;
use App\Models\PostReaction;
use App\Models\PostView;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(PostController::class)]
#[UsesClass(Post::class)]
#[UsesClass(PostReaction::class)]
#[UsesClass(PostView::class)]
#[UsesClass(User::class)]
final class PostDestroyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_deletes_the_post_and_returns_to_the_list(): void
    {
        $post = Post::factory()->published()->create();

        $this->actingAs(User::factory()->create())
            ->delete(route('admin.posts.destroy', ['post' => $post->id]))
            ->assertRedirect(route('admin.posts.index'));

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    #[Test]
    public function deleting_a_post_takes_its_views_and_reactions_with_it(): void
    {
        $post = Post::factory()->published()->create();
        PostView::factory()->count(3)->for($post)->create();
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Fire]);
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Heart]);

        $this->assertSame(3, PostView::query()->where('post_id', $post->id)->count());
        $this->assertSame(2, PostReaction::query()->where('post_id', $post->id)->count());

        $this->actingAs(User::factory()->create())
            ->delete(route('admin.posts.destroy', ['post' => $post->id]))
            ->assertRedirect(route('admin.posts.index'));

        $this->assertDatabaseMissing('post_views', ['post_id' => $post->id]);
        $this->assertDatabaseMissing('post_reactions', ['post_id' => $post->id]);
    }

    #[Test]
    public function guests_cannot_delete_a_post(): void
    {
        $post = Post::factory()->published()->create();

        $this->delete(route('admin.posts.destroy', ['post' => $post->id]))
            ->assertRedirect(route('login'));

        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }
}
