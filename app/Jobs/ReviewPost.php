<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\PostReviewStatus;
use App\Exceptions\PostReviewTimeoutMismatch;
use App\Models\Post;
use App\Services\PostReviewService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\FailOnTimeout;
use Illuminate\Queue\Attributes\Tries;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Reviews a saved post's body markdown in the background and persists the
 * structured notes. The dispatch-time authoring snapshot rides in the payload;
 * the post is rechecked against it both before prompting (no provider spend if
 * the post already moved) and under a row lock before persisting (the relocated
 * collision guard from the previous synchronous controller).
 */
#[FailOnTimeout]
#[Tries(1)]
final class ReviewPost implements ShouldQueue
{
    use Queueable;

    /**
     * Authoring attributes that, if changed between dispatch and persistence,
     * invalidate an in-flight review. Includes the body markdown under
     * `content`, which is what the reviewer actually reads.
     */
    private const array REVIEW_INVALIDATING_ATTRIBUTES = [
        'tag_id',
        'title',
        'slug',
        'description',
        'content',
        'content_html',
        'image',
        'reading_time_minutes',
        'published_at',
        'updated_at',
    ];

    /**
     * The job's own wall-clock deadline, deliberately above the provider
     * timeout and below the queue's `retry_after` so the worker chain is
     * `retry_after (180) > job_timeout (150) > ai_timeout (120)`.
     */
    public int $timeout;

    /**
     * @param  array<string, mixed>  $snapshot  dispatch-time authoring snapshot
     */
    public function __construct(
        public readonly int $postId,
        public readonly array $snapshot,
    ) {
        $this->timeout = Config::integer('ai.blog_review.job_timeout');
    }

    /**
     * Execute the job.
     */
    public function handle(PostReviewService $reviews): void
    {
        $post = $this->findPost($this->postId);

        if (! $post instanceof Post) {
            // Deleted mid-review; nothing to persist.
            return;
        }

        // Cheap pre-prompt recheck: if the post already moved, bail to
        // Superseded before spending a provider call.
        if (self::snapshotFor($post) !== $this->snapshot) {
            $this->markStatus($post, PostReviewStatus::Superseded);

            return;
        }

        $this->assertTimeoutChain();

        $content = $this->snapshot['content'] ?? null;

        if (! is_string($content)) {
            // The dispatch snapshot did not carry usable body markdown; treat
            // it like any other unusable in-flight review and stop without a
            // provider call.
            $this->markStatus($post, PostReviewStatus::Superseded);

            return;
        }

        $notes = $reviews->review($content, $this->postId);

        DB::transaction(function () use ($post, $notes): void {
            $current = Post::query()
                ->withoutGlobalScope('visibleToGuest')
                ->whereKey($post->getKey())
                ->lockForUpdate()
                ->first();

            if ($current === null) {
                return;
            }

            if (self::snapshotFor($current) !== $this->snapshot) {
                $this->markStatus($current, PostReviewStatus::Superseded);

                return;
            }

            $current->latest_review = $notes;
            $current->latest_review_at = now();
            $current->review_status = PostReviewStatus::Completed;

            Post::withoutTimestamps(fn (): bool => $current->saveOrFail());
        });
    }

    /**
     * Handle a job failure by surfacing it as a terminal `Failed` status, but
     * only while the review is still genuinely in-flight. A `handle()` that has
     * already resolved to `Completed` or `Superseded` must not be clobbered.
     */
    public function failed(Throwable $exception): void
    {
        $post = $this->findPost($this->postId);

        if (! $post instanceof Post) {
            return;
        }

        if (
            $post->review_status === PostReviewStatus::Completed
            || $post->review_status === PostReviewStatus::Superseded
        ) {
            return;
        }

        $this->markStatus($post, PostReviewStatus::Failed);
    }

    /**
     * Capture the raw authoring snapshot used both at dispatch and for the
     * collision rechecks inside the job.
     *
     * @return array<string, mixed>
     */
    public static function snapshotFor(Post $post): array
    {
        $snapshot = [];

        foreach (self::REVIEW_INVALIDATING_ATTRIBUTES as $attribute) {
            $snapshot[$attribute] = $post->getRawOriginal($attribute);
        }

        return $snapshot;
    }

    /**
     * Load a post regardless of publish state. The job runs in the queue worker
     * with no authenticated session, so the model's `visibleToGuest` scope
     * (which hides drafts from guests) must be bypassed — reviewing a draft is
     * the primary use case.
     */
    private function findPost(int $postId): ?Post
    {
        return Post::query()
            ->withoutGlobalScope('visibleToGuest')
            ->find($postId);
    }

    /**
     * Write a terminal status without disturbing `posts.updated_at`.
     */
    private function markStatus(Post $post, PostReviewStatus $status): void
    {
        $post->review_status = $status;

        Post::withoutTimestamps(fn (): bool => $post->saveOrFail());
    }

    /**
     * Assert the worker chain holds (`ai_timeout < job_timeout`) before any
     * provider call. A misconfiguration here is surfaced as a classified
     * failure rather than risking a silently-killed job.
     */
    private function assertTimeoutChain(): void
    {
        $aiTimeout = Config::integer('ai.blog_review.timeout');
        $jobTimeout = Config::integer('ai.blog_review.job_timeout');

        if ($aiTimeout < $jobTimeout) {
            return;
        }

        Log::warning('Blog post review timeout mismatch', [
            'post_id' => $this->postId,
            'ai_timeout_seconds' => $aiTimeout,
            'job_timeout_seconds' => $jobTimeout,
            'failure_type' => 'timeout_mismatch',
        ]);

        throw new PostReviewTimeoutMismatch(
            'The blog review timeout must be shorter than the job timeout.',
        );
    }
}
