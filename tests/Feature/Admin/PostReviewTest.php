<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\PostReviewStatus;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PostReviewController;
use App\Http\Requests\Admin\PostRequest;
use App\Jobs\ReviewPost;
use App\Models\Post;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

#[CoversClass(PostReviewController::class)]
#[CoversClass(PostController::class)]
#[UsesClass(ReviewPost::class)]
#[UsesClass(PostReviewStatus::class)]
#[UsesClass(PostRequest::class)]
#[UsesClass(Post::class)]
#[UsesClass(User::class)]
final class PostReviewTest extends TestCase
{
    use RefreshDatabase;

    private const array NOTES = [
        [
            'category' => 'Clarity',
            'excerpt' => 'This part is doing a lot.',
            'comment' => 'The reference is ambiguous.',
            'suggestion' => 'Name the specific operation instead.',
        ],
    ];

    #[Test]
    public function dispatch_marks_the_post_pending_returns_accepted_and_pushes_the_review_job(): void
    {
        $this->freezeTime();

        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subMinute(),
        ]);
        $originalUpdatedAt = $post->getRawOriginal('updated_at');

        Queue::fake();

        $this->actingAs(User::factory()->create())
            ->postJson(route('admin.posts.review', ['post' => $post->id]))
            ->assertAccepted();

        $post->refresh();

        Queue::assertPushed(ReviewPost::class, fn (ReviewPost $job): bool => $job->postId === $post->id && $job->snapshot === ReviewPost::snapshotFor($post));

        $this->assertSame(PostReviewStatus::Pending, $post->review_status);
        $this->assertSame(now()->toDateTimeString(), $post->review_dispatched_at?->toDateTimeString());
        $this->assertSame($originalUpdatedAt, $post->getRawOriginal('updated_at'));
    }

    #[Test]
    public function guests_receive_a_json_authentication_error(): void
    {
        Queue::fake();

        $post = Post::factory()->draft()->create();

        $this->review($post)->assertUnauthorized();

        Queue::assertNothingPushed();
    }

    #[Test]
    public function review_requests_are_limited_to_five_per_minute_per_user(): void
    {
        Queue::fake();

        $post = Post::factory()->draft()->create();

        $this->actingAs(User::factory()->create());

        for ($request = 0; $request < 5; $request++) {
            $this->review($post)->assertAccepted();
        }

        $this->review($post)->assertTooManyRequests();

        Queue::assertPushed(ReviewPost::class, 5);
    }

    #[Test]
    public function edit_page_renders_the_review_prop_for_a_completed_review(): void
    {
        $this->freezeTime();

        $reviewedAt = now()->subHour();
        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subHours(2),
        ]);
        $this->persistReview($post, PostReviewStatus::Completed, self::NOTES, $reviewedAt);

        $this->actingAs(User::factory()->create())
            ->get(route('admin.posts.edit', ['post' => $post->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('admin/posts/edit')
                ->where('review.status', 'completed')
                ->where('review.notes', self::NOTES)
                ->where('review.reviewedAt', $reviewedAt->toIso8601String())
                ->where('review.isStale', false));
    }

    #[Test]
    public function edit_page_renders_a_pending_status_when_a_review_is_in_flight(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview(
            $post,
            PostReviewStatus::Pending,
            self::NOTES,
            now()->subMinute(),
        );

        $this->actingAs(User::factory()->create())
            ->get(route('admin.posts.edit', ['post' => $post->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('admin/posts/edit')
                ->where('review.status', 'pending'));
    }

    #[Test]
    public function edit_page_renders_a_null_status_for_a_never_reviewed_post(): void
    {
        $post = Post::factory()->draft()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('admin.posts.edit', ['post' => $post->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('admin/posts/edit')
                ->where('review.status', null)
                ->where('review.notes', [])
                ->where('review.reviewedAt', null)
                ->where('review.dispatchedAt', null));
    }

    #[Test]
    public function metadata_only_updates_mark_the_existing_review_as_stale(): void
    {
        $this->freezeTime();

        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subMinutes(2),
        ]);
        $this->persistReview(
            $post,
            PostReviewStatus::Completed,
            self::NOTES,
            now()->subMinute(),
        );

        $this->travel(2)->minutes();

        $this->actingAs(User::factory()->create())
            ->patch(route('admin.posts.update', ['post' => $post->id]), $this->payload($post, [
                'title' => 'Metadata changed, body did not',
            ]))
            ->assertSessionHasNoErrors();

        $this->get(route('admin.posts.edit', ['post' => $post->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('admin/posts/edit')
                ->where('review.status', 'completed')
                ->where('review.notes', self::NOTES)
                ->where('review.isStale', true));
    }

    /**
     * @return TestResponse<Response>
     */
    private function review(Post $post): TestResponse
    {
        return $this->postJson(route('admin.posts.review', ['post' => $post->id]));
    }

    /**
     * @param  ?list<array{category: string, excerpt: string, comment: string, suggestion: string}>  $notes
     */
    private function persistReview(
        Post $post,
        PostReviewStatus $status,
        ?array $notes,
        CarbonImmutable $reviewedAt,
    ): void {
        $post->latest_review = $notes;
        $post->latest_review_at = $reviewedAt;
        $post->review_status = $status;

        Post::withoutTimestamps(fn (): bool => $post->save());
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(Post $post, array $overrides = []): array
    {
        return array_merge([
            'title' => $post->title,
            'slug' => $post->slug,
            'description' => $post->description,
            'tag_id' => $post->tag_id,
            'content' => $post->content,
            'status' => 'draft',
        ], $overrides);
    }
}
