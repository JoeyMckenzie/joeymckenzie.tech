<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Ai\Agents\BlogPostReviewer;
use App\Ai\Middleware\LogBlogPostReview;
use App\Enums\PostReviewCategory;
use App\Exceptions\InvalidPostReview;
use App\Exceptions\PostReviewRuntimeTimeoutMismatch;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PostReviewController;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Post;
use App\Models\User;
use App\Services\PostReviewService;
use Carbon\CarbonImmutable;
use GuzzleHttp\Psr7\Response as Psr7Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Log;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Ai\Prompts\AgentPrompt;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

#[CoversClass(PostReviewController::class)]
#[CoversClass(PostReviewService::class)]
#[UsesClass(BlogPostReviewer::class)]
#[UsesClass(LogBlogPostReview::class)]
#[UsesClass(InvalidPostReview::class)]
#[UsesClass(PostReviewRuntimeTimeoutMismatch::class)]
#[UsesClass(PostReviewCategory::class)]
#[UsesClass(PostController::class)]
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
    public function it_persists_and_returns_a_structured_review_without_touching_the_post_revision(): void
    {
        $this->freezeTime();

        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subMinute(),
        ]);
        $originalUpdatedAt = $post->updated_at;

        BlogPostReviewer::fake([
            ['notes' => self::NOTES],
        ])->preventStrayPrompts();

        $response = $this->actingAs(User::factory()->create())
            ->postJson(route('admin.posts.review', ['post' => $post->id]))
            ->assertOk()
            ->assertJsonPath('review.reviewedAt', now()->toIso8601String())
            ->assertJsonPath('review.isStale', false);

        $this->assertEquals(self::NOTES, $response->json('review.notes'));

        $post->refresh();

        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame(now()->toDateTimeString(), $post->latest_review_at?->toDateTimeString());
        $this->assertSame($originalUpdatedAt?->toDateTimeString(), $post->updated_at?->toDateTimeString());
    }

    #[Test]
    public function it_prompts_with_the_body_markdown_only_and_uses_the_configured_defaults(): void
    {
        $post = Post::factory()->draft()->create([
            'title' => 'TITLE-MUST-NOT-LEAK',
            'description' => 'DESCRIPTION-MUST-NOT-LEAK',
            'content' => "# Exact body\n\nOnly this markdown belongs in the prompt.",
        ]);

        BlogPostReviewer::fake([
            ['notes' => self::NOTES],
        ])->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)->assertOk();

        BlogPostReviewer::assertPrompted(
            fn (AgentPrompt $prompt): bool => $prompt->prompt === $post->content
                && ! $prompt->contains('TITLE-MUST-NOT-LEAK')
                && ! $prompt->contains('DESCRIPTION-MUST-NOT-LEAK')
                && $prompt->provider->name() === 'anthropic'
                && $prompt->model === 'claude-sonnet-5'
                && $prompt->timeout === 120,
        );
    }

    #[Test]
    public function it_logs_safe_review_lifecycle_metadata(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create([
            'content' => 'SENSITIVE-POST-MARKDOWN',
        ]);
        $notes = self::NOTES;
        $notes[0]['suggestion'] = 'SENSITIVE-MODEL-OUTPUT';

        BlogPostReviewer::fake([
            ['notes' => $notes],
        ])->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)->assertOk();

        $reviewStarted = $this->logContext($logged, 'Blog post review started');
        $this->assertSame($post->id, $reviewStarted['post_id']);
        $this->assertSame('anthropic', $reviewStarted['provider']);
        $this->assertSame('claude-sonnet-5', $reviewStarted['model']);
        $this->assertSame(120, $reviewStarted['timeout_seconds']);
        $this->assertIsInt($reviewStarted['php_max_execution_time_seconds']);
        $this->assertGreaterThanOrEqual(0, $reviewStarted['php_max_execution_time_seconds']);
        $this->assertSame(strlen($post->content), $reviewStarted['prompt_characters']);

        $reviewerPrompted = $this->logContext($logged, 'Blog post reviewer prompted');
        $this->assertSame('anthropic', $reviewerPrompted['provider']);
        $this->assertSame('claude-sonnet-5', $reviewerPrompted['model']);
        $this->assertSame(120, $reviewerPrompted['timeout_seconds']);
        $this->assertSame(strlen($post->content), $reviewerPrompted['prompt_characters']);
        $this->assertArrayHasKey('review_request_id', $reviewerPrompted);

        $reviewerResponded = $this->logContext($logged, 'Blog post reviewer responded');
        $this->assertIsString($reviewerResponded['invocation_id']);
        $this->assertNotSame('', $reviewerResponded['invocation_id']);
        $this->assertSame($reviewerPrompted['review_request_id'], $reviewerResponded['review_request_id']);
        $this->assertArrayHasKey('duration_ms', $reviewerResponded);
        $this->assertArrayHasKey('prompt_tokens', $reviewerResponded);
        $this->assertArrayHasKey('completion_tokens', $reviewerResponded);

        $reviewCompleted = $this->logContext($logged, 'Blog post review completed');
        $this->assertSame(1, $reviewCompleted['attempt']);
        $this->assertSame(1, $reviewCompleted['notes_count']);
        $this->assertArrayHasKey('duration_ms', $reviewCompleted);

        $this->assertLogsDoNotContain($logged, [
            'SENSITIVE-POST-MARKDOWN',
            'SENSITIVE-MODEL-OUTPUT',
        ]);
    }

    #[Test]
    public function it_persists_a_clean_review_as_an_empty_note_list_with_a_timestamp(): void
    {
        $post = Post::factory()->draft()->create();

        BlogPostReviewer::fake([
            ['notes' => []],
        ])->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)
            ->assertOk()
            ->assertJsonPath('review.notes', []);

        $post->refresh();

        $this->assertSame([], $post->latest_review);
        $this->assertNotNull($post->latest_review_at);
    }

    #[Test]
    public function guests_receive_a_json_authentication_error(): void
    {
        BlogPostReviewer::fake()->preventStrayPrompts();
        $post = Post::factory()->draft()->create();

        $this->review($post)->assertUnauthorized();

        BlogPostReviewer::assertNeverPrompted();
    }

    #[Test]
    public function review_requests_are_limited_to_five_per_minute_per_user(): void
    {
        $attempts = 0;
        $post = Post::factory()->draft()->create();

        BlogPostReviewer::fake(function () use (&$attempts): array {
            $attempts++;

            return ['notes' => self::NOTES];
        })->preventStrayPrompts();

        $this->actingAs(User::factory()->create());

        for ($request = 0; $request < 5; $request++) {
            $this->review($post)->assertOk();
        }

        $this->review($post)->assertTooManyRequests();
        $this->assertSame(5, $attempts);
    }

    #[Test]
    public function it_retries_an_invalid_category_then_persists_the_valid_response(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create();
        $attempts = 0;

        BlogPostReviewer::fake(function () use (&$attempts): array {
            $attempts++;

            if ($attempts === 1) {
                $invalidNotes = self::NOTES;
                $invalidNotes[0]['category'] = 'Grammar';

                return ['notes' => $invalidNotes];
            }

            return ['notes' => self::NOTES];
        })->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)->assertOk();

        $this->assertSame(2, $attempts);
        $this->assertEquals(self::NOTES, $post->refresh()->latest_review);
        $this->assertCount(2, $this->logContexts($logged, 'Blog post review attempt started'));

        $invalidResponse = $this->logContext($logged, 'Blog post review response invalid');
        $this->assertSame(1, $invalidResponse['attempt']);
        $this->assertTrue($invalidResponse['will_retry']);
        $this->assertSame(InvalidPostReview::class, $invalidResponse['exception_class']);

        $completed = $this->logContext($logged, 'Blog post review completed');
        $this->assertSame(2, $completed['attempt']);
        $this->assertSame([], $this->logContexts($logged, 'Blog post review failed'));
    }

    #[Test]
    public function two_invalid_shapes_surface_an_error_and_retain_the_previous_review(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subHours(2),
        ]);
        $previousReviewedAt = now()->subHour();
        $this->persistPreviousReview($post, $previousReviewedAt);
        $attempts = 0;

        BlogPostReviewer::fake(function () use (&$attempts): array {
            $attempts++;

            return [];
        })->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)
            ->assertStatus(503)
            ->assertJsonPath('message', 'The review could not be completed. Please retry.');

        $post->refresh();

        $this->assertSame(2, $attempts);
        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame($previousReviewedAt->format('Y-m-d H:i:s'), $post->latest_review_at?->toDateTimeString());

        $invalidResponses = $this->logContexts($logged, 'Blog post review response invalid');
        $this->assertCount(2, $invalidResponses);
        $this->assertTrue($invalidResponses[0]['will_retry']);
        $this->assertFalse($invalidResponses[1]['will_retry']);

        $failed = $this->logContext($logged, 'Blog post review failed');
        $this->assertSame('invalid_response', $failed['failure_type']);
        $this->assertSame(2, $failed['attempt']);
    }

    #[Test]
    public function a_provider_error_is_not_retried_and_retains_the_previous_review(): void
    {
        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subHours(2),
        ]);
        $previousReviewedAt = now()->subHour();
        $this->persistPreviousReview($post, $previousReviewedAt);
        $attempts = 0;

        BlogPostReviewer::fake(function () use (&$attempts): never {
            $attempts++;

            throw new RuntimeException('Provider unavailable.');
        })->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)->assertStatus(503);

        $post->refresh();

        $this->assertSame(1, $attempts);
        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame($previousReviewedAt->format('Y-m-d H:i:s'), $post->latest_review_at?->toDateTimeString());
    }

    #[Test]
    public function a_runtime_timeout_mismatch_is_logged_before_prompting_the_provider(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create();
        BlogPostReviewer::fake()->preventStrayPrompts();
        $previousMaxExecutionTime = ini_set('max_execution_time', '30');

        $this->assertNotFalse($previousMaxExecutionTime);

        try {
            $this->actingAs(User::factory()->create());
            $this->review($post)
                ->assertStatus(503)
                ->assertJsonPath('message', 'The review could not be completed. Please retry.');
        } finally {
            ini_set('max_execution_time', $previousMaxExecutionTime);
        }

        BlogPostReviewer::assertNeverPrompted();

        $started = $this->logContext($logged, 'Blog post review started');
        $this->assertSame(30, $started['php_max_execution_time_seconds']);

        $failed = $this->logContext($logged, 'Blog post review failed');
        $this->assertSame($post->id, $failed['post_id']);
        $this->assertSame(0, $failed['attempt']);
        $this->assertSame('runtime_timeout_mismatch', $failed['failure_type']);
        $this->assertSame(PostReviewRuntimeTimeoutMismatch::class, $failed['exception_class']);
        $this->assertSame(120, $failed['timeout_seconds']);
        $this->assertSame(30, $failed['php_max_execution_time_seconds']);
    }

    #[Test]
    public function it_logs_connection_failures_without_the_exception_message(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create();

        BlogPostReviewer::fake(
            fn (): never => throw new ConnectionException('SENSITIVE-CONNECTION-DETAIL'),
        )->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)->assertStatus(503);

        $failed = $this->logContext($logged, 'Blog post review failed');
        $this->assertSame($post->id, $failed['post_id']);
        $this->assertSame(1, $failed['attempt']);
        $this->assertSame('connection', $failed['failure_type']);
        $this->assertSame(ConnectionException::class, $failed['exception_class']);
        $this->assertArrayNotHasKey('provider_status', $failed);
        $this->assertArrayNotHasKey('provider_request_id', $failed);
        $this->assertLogsDoNotContain($logged, ['SENSITIVE-CONNECTION-DETAIL']);
    }

    #[Test]
    public function it_logs_safe_provider_http_failure_diagnostics(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create();
        $providerException = new RequestException(new HttpResponse(new Psr7Response(
            529,
            ['request-id' => 'req_safe-123'],
            '{"error":{"message":"SENSITIVE-PROVIDER-BODY"}}',
        )));

        BlogPostReviewer::fake(
            fn (): never => throw $providerException,
        )->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)->assertStatus(503);

        $failed = $this->logContext($logged, 'Blog post review failed');
        $this->assertSame($post->id, $failed['post_id']);
        $this->assertSame(1, $failed['attempt']);
        $this->assertSame('provider_http', $failed['failure_type']);
        $this->assertSame(RequestException::class, $failed['exception_class']);
        $this->assertSame(529, $failed['provider_status']);
        $this->assertSame('req_safe-123', $failed['provider_request_id']);
        $this->assertLogsDoNotContain($logged, ['SENSITIVE-PROVIDER-BODY']);
    }

    #[Test]
    public function metadata_only_updates_mark_the_existing_review_as_stale(): void
    {
        $this->freezeTime();

        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subMinutes(2),
            'latest_review' => self::NOTES,
            'latest_review_at' => now()->subMinute(),
        ]);

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
                ->where('post.review.notes', self::NOTES)
                ->where('post.review.isStale', true));
    }

    #[Test]
    public function an_authoring_change_with_the_same_updated_at_does_not_overwrite_the_previous_review(): void
    {
        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subHours(2),
        ]);
        $originalUpdatedAt = $post->getRawOriginal('updated_at');
        $previousReviewedAt = now()->subHour();
        $this->persistPreviousReview($post, $previousReviewedAt);

        BlogPostReviewer::fake(function () use ($post): array {
            $post->title = 'Changed in another tab';

            Post::withoutTimestamps(fn (): bool => $post->save());

            return ['notes' => self::NOTES];
        })->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)
            ->assertConflict()
            ->assertJsonPath(
                'message',
                'The post changed while the review was running. Save and retry.',
            );

        $post->refresh();

        $this->assertSame($originalUpdatedAt, $post->getRawOriginal('updated_at'));
        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame($previousReviewedAt->format('Y-m-d H:i:s'), $post->latest_review_at?->toDateTimeString());
    }

    #[Test]
    public function a_post_deleted_during_review_returns_a_conflict(): void
    {
        $post = Post::factory()->draft()->create();

        BlogPostReviewer::fake(function () use ($post): array {
            $post->delete();

            return ['notes' => self::NOTES];
        })->preventStrayPrompts();

        $this->actingAs(User::factory()->create());
        $this->review($post)
            ->assertConflict()
            ->assertJsonPath(
                'message',
                'The post changed while the review was running. Save and retry.',
            );

        $this->assertModelMissing($post);
    }

    /**
     * @return TestResponse<Response>
     */
    private function review(Post $post): TestResponse
    {
        return $this->postJson(route('admin.posts.review', ['post' => $post->id]));
    }

    private function persistPreviousReview(Post $post, CarbonImmutable $reviewedAt): void
    {
        $post->latest_review = self::NOTES;
        $post->latest_review_at = $reviewedAt;

        Post::withoutTimestamps(fn (): bool => $post->save());
    }

    /**
     * @param  list<MessageLogged>  $logged
     * @return array<string, mixed>
     */
    private function logContext(array $logged, string $message): array
    {
        $contexts = $this->logContexts($logged, $message);

        $this->assertCount(1, $contexts, sprintf('Expected one [%s] log entry.', $message));

        return $contexts[0];
    }

    /**
     * @param  list<MessageLogged>  $logged
     * @return list<array<string, mixed>>
     */
    private function logContexts(array $logged, string $message): array
    {
        $contexts = [];

        foreach ($logged as $entry) {
            if ($entry->message === $message) {
                $contexts[] = $this->stringKeyedContext($entry->context);
            }
        }

        return $contexts;
    }

    /**
     * @param  array<array-key, mixed>  $context
     * @return array<string, mixed>
     */
    private function stringKeyedContext(array $context): array
    {
        $stringKeyedContext = [];

        foreach ($context as $key => $value) {
            if (is_string($key)) {
                $stringKeyedContext[$key] = $value;
            }
        }

        return $stringKeyedContext;
    }

    /**
     * @param  list<MessageLogged>  $logged
     * @param  list<string>  $sensitiveValues
     */
    private function assertLogsDoNotContain(array $logged, array $sensitiveValues): void
    {
        foreach ($logged as $entry) {
            $encoded = json_encode([
                'message' => $entry->message,
                'context' => $entry->context,
            ], JSON_THROW_ON_ERROR);

            foreach ($sensitiveValues as $sensitiveValue) {
                $this->assertStringNotContainsString($sensitiveValue, $encoded);
            }
        }
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
