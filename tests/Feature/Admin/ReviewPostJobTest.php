<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Ai\Agents\BlogPostReviewer;
use App\Ai\Middleware\LogBlogPostReview;
use App\Enums\PostReviewCategory;
use App\Enums\PostReviewStatus;
use App\Exceptions\InvalidPostReview;
use App\Exceptions\PostReviewTimeoutMismatch;
use App\Jobs\ReviewPost;
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
use Laravel\Ai\Prompts\AgentPrompt;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use RuntimeException;
use Tests\TestCase;
use Throwable;

#[CoversClass(ReviewPost::class)]
#[UsesClass(PostReviewService::class)]
#[UsesClass(BlogPostReviewer::class)]
#[UsesClass(LogBlogPostReview::class)]
#[UsesClass(InvalidPostReview::class)]
#[UsesClass(PostReviewTimeoutMismatch::class)]
#[UsesClass(PostReviewCategory::class)]
#[UsesClass(PostReviewStatus::class)]
#[UsesClass(Post::class)]
#[UsesClass(User::class)]
final class ReviewPostJobTest extends TestCase
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
    public function a_completed_review_persists_notes_without_touching_the_post_revision(): void
    {
        $this->freezeTime();

        $post = Post::factory()->draft()->create([
            'updated_at' => now()->subMinute(),
        ]);
        $originalUpdatedAt = $post->getRawOriginal('updated_at');

        BlogPostReviewer::fake([
            ['notes' => self::NOTES],
        ])->preventStrayPrompts();

        $this->runJob($this->jobFor($post));

        $post->refresh();

        $this->assertSame(PostReviewStatus::Completed, $post->review_status);
        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame(now()->toDateTimeString(), $post->latest_review_at?->toDateTimeString());
        $this->assertSame($originalUpdatedAt, $post->getRawOriginal('updated_at'));
    }

    #[Test]
    public function a_replacement_returned_by_the_reviewer_persists_into_the_latest_review(): void
    {
        $post = Post::factory()->draft()->create();

        $note = self::NOTES[0];
        $note['replacement'] = 'Name the specific operation instead.';

        BlogPostReviewer::fake([
            ['notes' => [$note]],
        ])->preventStrayPrompts();

        $this->runJob($this->jobFor($post));

        $post->refresh();

        $this->assertSame(PostReviewStatus::Completed, $post->review_status);
        $this->assertEquals([$note], $post->latest_review);
    }

    #[Test]
    public function a_clean_review_persists_an_empty_note_list(): void
    {
        BlogPostReviewer::fake([
            ['notes' => []],
        ])->preventStrayPrompts();

        $post = Post::factory()->draft()->create();
        $this->runJob($this->jobFor($post));

        $post->refresh();

        $this->assertSame(PostReviewStatus::Completed, $post->review_status);
        $this->assertSame([], $post->latest_review);
        $this->assertNotNull($post->latest_review_at);
    }

    #[Test]
    public function a_provider_error_marks_the_review_failed_and_retains_the_previous_review(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview($post, PostReviewStatus::Completed, self::NOTES, now()->subHour());
        $previousReviewedAt = $post->latest_review_at;
        // The controller marks the post Pending when dispatching a new review,
        // retaining the prior completed review's notes and timestamp.
        $post->review_status = PostReviewStatus::Pending;
        Post::withoutTimestamps(fn (): bool => $post->save());
        $attempts = 0;

        BlogPostReviewer::fake(function () use (&$attempts): never {
            $attempts++;

            throw new RuntimeException('Provider unavailable.');
        })->preventStrayPrompts();

        $this->runJob($this->jobFor($post));

        $post->refresh();

        $this->assertSame(PostReviewStatus::Failed, $post->review_status);
        $this->assertSame(1, $attempts);
        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame($previousReviewedAt?->toDateTimeString(), $post->latest_review_at?->toDateTimeString());
    }

    #[Test]
    public function a_connection_failure_is_marked_failed_without_logging_the_exception_message(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        $post = Post::factory()->draft()->create();

        BlogPostReviewer::fake(
            fn (): never => throw new ConnectionException('SENSITIVE-CONNECTION-DETAIL'),
        )->preventStrayPrompts();

        $this->runJob($this->jobFor($post));

        $failed = $this->logContext($logged, 'Blog post review failed');
        $this->assertSame($post->id, $failed['post_id']);
        $this->assertSame(1, $failed['attempt']);
        $this->assertSame('connection', $failed['failure_type']);
        $this->assertSame(ConnectionException::class, $failed['exception_class']);
        $this->assertArrayNotHasKey('provider_status', $failed);
        $this->assertArrayNotHasKey('provider_request_id', $failed);
        $this->assertLogsDoNotContain($logged, ['SENSITIVE-CONNECTION-DETAIL']);
        $this->assertSame(PostReviewStatus::Failed, $post->refresh()->review_status);
    }

    #[Test]
    public function an_invalid_response_after_retry_marks_the_review_failed(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview($post, PostReviewStatus::Completed, self::NOTES, now()->subHour());
        $previousReviewedAt = $post->latest_review_at;
        // The controller marks the post Pending when dispatching a new review,
        // retaining the prior completed review's notes and timestamp.
        $post->review_status = PostReviewStatus::Pending;
        Post::withoutTimestamps(fn (): bool => $post->save());
        $attempts = 0;

        BlogPostReviewer::fake(function () use (&$attempts): array {
            $attempts++;

            return [];
        })->preventStrayPrompts();

        $this->runJob($this->jobFor($post));

        $post->refresh();

        $this->assertSame(2, $attempts);
        $this->assertSame(PostReviewStatus::Failed, $post->review_status);
        $this->assertEquals(self::NOTES, $post->latest_review);
        $this->assertSame($previousReviewedAt?->toDateTimeString(), $post->latest_review_at?->toDateTimeString());
    }

    #[Test]
    public function a_snapshot_mismatch_before_prompting_marks_the_review_superseded(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview($post, PostReviewStatus::Completed, self::NOTES, now()->subHour());

        $snapshot = ReviewPost::snapshotFor($post);

        $post->content = '# Changed before the job ran';
        Post::withoutTimestamps(fn (): bool => $post->save());

        BlogPostReviewer::fake()->preventStrayPrompts();

        $this->runJob(new ReviewPost($post->id, $snapshot));

        $post->refresh();

        $this->assertSame(PostReviewStatus::Superseded, $post->review_status);
        $this->assertEquals(self::NOTES, $post->latest_review);

        BlogPostReviewer::assertNeverPrompted();
    }

    #[Test]
    public function a_snapshot_mismatch_under_lock_marks_the_review_superseded(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview($post, PostReviewStatus::Pending, self::NOTES, now()->subHour());

        $snapshot = ReviewPost::snapshotFor($post);

        BlogPostReviewer::fake(function () use ($post): array {
            // Mutate the post while the provider call is in flight so the
            // under-lock recheck sees a different authoring snapshot.
            $post->content = '# Changed while reviewing';
            Post::withoutTimestamps(fn (): bool => $post->save());

            return ['notes' => self::NOTES];
        })->preventStrayPrompts();

        $this->runJob(new ReviewPost($post->id, $snapshot));

        $post->refresh();

        $this->assertSame(PostReviewStatus::Superseded, $post->review_status);
        $this->assertEquals(self::NOTES, $post->latest_review);
    }

    #[Test]
    public function a_post_deleted_before_handling_is_a_noop(): void
    {
        $post = Post::factory()->draft()->create();
        $job = $this->jobFor($post);

        $post->delete();

        BlogPostReviewer::fake()->preventStrayPrompts();

        $this->runJob($job);

        $this->assertModelMissing($post);

        BlogPostReviewer::assertNeverPrompted();
    }

    #[Test]
    public function a_late_failure_does_not_clobber_a_completed_review(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview($post, PostReviewStatus::Completed, self::NOTES, now());

        $this->jobFor($post)->failed(new RuntimeException('late failure'));

        $this->assertSame(PostReviewStatus::Completed, $post->refresh()->review_status);
    }

    #[Test]
    public function a_late_failure_does_not_clobber_a_superseded_review(): void
    {
        $post = Post::factory()->draft()->create();
        $this->persistReview($post, PostReviewStatus::Superseded, self::NOTES, now());

        $this->jobFor($post)->failed(new RuntimeException('late failure'));

        $this->assertSame(PostReviewStatus::Superseded, $post->refresh()->review_status);
    }

    #[Test]
    public function a_post_deleted_before_failure_handling_does_not_error(): void
    {
        $post = Post::factory()->draft()->create();
        $job = $this->jobFor($post);

        $post->delete();

        $job->failed(new RuntimeException('boom'));

        $this->assertModelMissing($post);
    }

    #[Test]
    public function a_timeout_mismatch_marks_the_review_failed_before_prompting(): void
    {
        $logged = [];
        Log::listen(static function (MessageLogged $message) use (&$logged): void {
            $logged[] = $message;
        });

        config([
            'ai.blog_review.timeout' => 200,
            'ai.blog_review.job_timeout' => 150,
        ]);

        $post = Post::factory()->draft()->create();

        BlogPostReviewer::fake()->preventStrayPrompts();

        $this->runJob($this->jobFor($post));

        BlogPostReviewer::assertNeverPrompted();

        $this->assertSame(PostReviewStatus::Failed, $post->refresh()->review_status);

        $mismatch = $this->logContext($logged, 'Blog post review timeout mismatch');
        $this->assertSame('timeout_mismatch', $mismatch['failure_type']);
        $this->assertSame($post->id, $mismatch['post_id']);
        $this->assertSame(200, $mismatch['ai_timeout_seconds']);
        $this->assertSame(150, $mismatch['job_timeout_seconds']);
    }

    #[Test]
    public function the_job_logs_safe_review_lifecycle_metadata(): void
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

        $this->runJob($this->jobFor($post));

        $started = $this->logContext($logged, 'Blog post review started');
        $this->assertSame($post->id, $started['post_id']);
        $this->assertSame('anthropic', $started['provider']);
        $this->assertSame('claude-sonnet-5', $started['model']);
        $this->assertSame(120, $started['timeout_seconds']);
        $this->assertSame(strlen($post->content), $started['prompt_characters']);

        $reviewerPrompted = $this->logContext($logged, 'Blog post reviewer prompted');
        $this->assertSame('anthropic', $reviewerPrompted['provider']);
        $this->assertSame('claude-sonnet-5', $reviewerPrompted['model']);
        $this->assertSame(120, $reviewerPrompted['timeout_seconds']);
        $this->assertSame(strlen($post->content), $reviewerPrompted['prompt_characters']);
        $this->assertArrayHasKey('review_request_id', $reviewerPrompted);

        $completed = $this->logContext($logged, 'Blog post review completed');
        $this->assertSame(1, $completed['attempt']);
        $this->assertSame(1, $completed['notes_count']);

        $this->assertLogsDoNotContain($logged, [
            'SENSITIVE-POST-MARKDOWN',
            'SENSITIVE-MODEL-OUTPUT',
        ]);

        BlogPostReviewer::assertPrompted(
            fn (AgentPrompt $prompt): bool => $prompt->prompt === $post->content,
        );
    }

    #[Test]
    public function the_job_logs_safe_provider_http_diagnostics(): void
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

        $this->runJob($this->jobFor($post));

        $failed = $this->logContext($logged, 'Blog post review failed');
        $this->assertSame($post->id, $failed['post_id']);
        $this->assertSame(1, $failed['attempt']);
        $this->assertSame('provider_http', $failed['failure_type']);
        $this->assertSame(RequestException::class, $failed['exception_class']);
        $this->assertSame(529, $failed['provider_status']);
        $this->assertSame('req_safe-123', $failed['provider_request_id']);
        $this->assertLogsDoNotContain($logged, ['SENSITIVE-PROVIDER-BODY']);
    }

    private function jobFor(Post $post): ReviewPost
    {
        return new ReviewPost($post->id, ReviewPost::snapshotFor($post));
    }

    /**
     * Run a job the way the worker would: execute it, and route any thrown
     * exception through the `failed()` handler so terminal statuses are written.
     */
    private function runJob(ReviewPost $job): void
    {
        try {
            $job->handle(app(PostReviewService::class));
        } catch (Throwable $throwable) {
            $job->failed($throwable);
        }
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
}
