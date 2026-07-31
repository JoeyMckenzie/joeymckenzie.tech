<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Enums\Reaction;
use App\Http\Controllers\PostReactionController;
use App\Models\Post;
use App\Models\PostReaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(PostReactionController::class)]
final class PostReactionTest extends TestCase
{
    use RefreshDatabase;

    /** The visitor hash the test client (127.0.0.1) resolves to. */
    private function visitorHash(): string
    {
        return hash('xxh128', Config::string('app.key').'|127.0.0.1');
    }

    #[Test]
    public function the_index_returns_per_type_counts_and_the_visitors_reactions(): void
    {
        $post = Post::factory()->published()->create();

        // This visitor reacted fire + heart; a different visitor also reacted fire.
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Fire, 'ip_hash' => $this->visitorHash()]);
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Heart, 'ip_hash' => $this->visitorHash()]);
        PostReaction::factory()->for($post)->create(['reaction' => Reaction::Fire, 'ip_hash' => hash('xxh128', 'someone-else')]);

        $response = $this->getJson(route('blog.reactions.index', $post))->assertOk();

        $response->assertJsonPath('counts.fire', 2);
        $response->assertJsonPath('counts.heart', 1);
        $response->assertJsonPath('counts.thumbs_up', 0);
        $response->assertJsonPath('counts.mind_blown', 0);
        $response->assertJsonCount(2, 'userReactions');
        $this->assertEqualsCanonicalizing(['fire', 'heart'], $response->json('userReactions'));
    }

    #[Test]
    public function storing_a_reaction_toggles_it_on_then_off(): void
    {
        $post = Post::factory()->published()->create();

        $added = $this->postJson(route('blog.reactions.store', $post), ['reaction' => 'fire'])->assertOk();
        $added->assertJsonPath('counts.fire', 1);
        $added->assertJsonPath('userReactions', ['fire']);
        $this->assertDatabaseHas('post_reactions', [
            'post_id' => $post->id,
            'reaction' => 'fire',
            'ip_hash' => $this->visitorHash(),
        ]);

        $removed = $this->postJson(route('blog.reactions.store', $post), ['reaction' => 'fire'])->assertOk();
        $removed->assertJsonPath('counts.fire', 0);
        $removed->assertJsonPath('userReactions', []);
        $this->assertDatabaseMissing('post_reactions', [
            'post_id' => $post->id,
            'reaction' => 'fire',
            'ip_hash' => $this->visitorHash(),
        ]);
    }

    #[Test]
    public function it_rejects_a_reaction_outside_the_enum(): void
    {
        $post = Post::factory()->published()->create();

        $this->postJson(route('blog.reactions.store', $post), ['reaction' => 'clown'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('reaction');

        $this->assertDatabaseCount('post_reactions', 0);
    }

    #[Test]
    public function the_store_endpoint_is_rate_limited(): void
    {
        $post = Post::factory()->published()->create();

        for ($i = 0; $i < 30; $i++) {
            $this->postJson(route('blog.reactions.store', $post), ['reaction' => 'fire'])->assertOk();
        }

        $this->postJson(route('blog.reactions.store', $post), ['reaction' => 'fire'])->assertStatus(429);
    }

    #[Test]
    public function reactions_cascade_delete_with_their_post(): void
    {
        $post = Post::factory()->published()->create();
        PostReaction::factory()->for($post)->count(3)->create();

        $post->delete();

        $this->assertDatabaseCount('post_reactions', 0);
    }

    #[Test]
    public function guests_cannot_react_to_a_draft_post(): void
    {
        $draft = Post::factory()->draft()->create();

        $this->postJson(route('blog.reactions.store', $draft), ['reaction' => 'fire'])->assertNotFound();
    }
}
