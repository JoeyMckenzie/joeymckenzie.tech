<?php

declare(strict_types=1);

namespace App\Services;

use App\Ai\Agents\BlogPostReviewer;
use App\Enums\PostReviewCategory;
use App\Exceptions\InvalidPostReview;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Ai\Responses\StructuredAgentResponse;
use Throwable;

final readonly class PostReviewService
{
    public function __construct(
        private BlogPostReviewer $reviewer,
    ) {
        //
    }

    /**
     * @return list<array{category: string, excerpt: string, comment: string, suggestion: string}>
     */
    public function review(string $markdown, int $postId): array
    {
        $provider = Config::string('ai.blog_review.provider');
        $model = Config::string('ai.blog_review.model');
        $timeout = Config::integer('ai.blog_review.timeout');
        $startedAt = (int) hrtime(true);
        $attempt = 0;
        $context = [
            'review_id' => (string) Str::uuid7(),
            'post_id' => $postId,
            'provider' => $provider,
            'model' => $model,
            'timeout_seconds' => $timeout,
            'prompt_characters' => Str::length($markdown),
        ];

        Log::info('Blog post review started', $context);

        try {
            for ($nextAttempt = 1; $nextAttempt <= 2; $nextAttempt++) {
                $attempt = $nextAttempt;
                $attemptStartedAt = (int) hrtime(true);

                Log::info('Blog post review attempt started', [
                    ...$context,
                    'attempt' => $attempt,
                ]);

                try {
                    $notes = $this->notes($this->prompt($markdown, $provider, $model, $timeout));
                } catch (InvalidPostReview $exception) {
                    Log::warning('Blog post review response invalid', [
                        ...$context,
                        'attempt' => $attempt,
                        'will_retry' => $attempt === 1,
                        'attempt_duration_ms' => $this->elapsedMilliseconds($attemptStartedAt),
                        'exception_class' => $exception::class,
                    ]);

                    if ($attempt === 2) {
                        throw $exception;
                    }

                    continue;
                }

                Log::info('Blog post review completed', [
                    ...$context,
                    'attempt' => $attempt,
                    'notes_count' => count($notes),
                    'attempt_duration_ms' => $this->elapsedMilliseconds($attemptStartedAt),
                    'duration_ms' => $this->elapsedMilliseconds($startedAt),
                ]);

                return $notes;
            }
        } catch (Throwable $throwable) {
            Log::warning('Blog post review failed', [
                ...$context,
                'attempt' => $attempt,
                'duration_ms' => $this->elapsedMilliseconds($startedAt),
                ...$this->failureContext($throwable),
            ]);

            throw $throwable;
        }

        throw new InvalidPostReview('The review response was invalid.');
    }

    /**
     * @return array<mixed>
     */
    private function prompt(string $markdown, string $provider, string $model, int $timeout): array
    {
        $response = $this->reviewer->prompt(
            $markdown,
            provider: $provider,
            model: $model,
            timeout: $timeout,
        );

        if (! $response instanceof StructuredAgentResponse) {
            throw new InvalidPostReview('The review response was invalid.');
        }

        return $response->toArray();
    }

    /**
     * @param  array<mixed>  $structured
     * @return list<array{category: string, excerpt: string, comment: string, suggestion: string}>
     */
    private function notes(array $structured): array
    {
        $notes = $structured['notes'] ?? null;

        if (! is_array($notes) || ! array_is_list($notes)) {
            throw new InvalidPostReview('The review notes were missing.');
        }

        return array_map(function (mixed $note): array {
            if (! is_array($note)) {
                throw new InvalidPostReview('A review note was invalid.');
            }

            $category = $note['category'] ?? null;
            $excerpt = $note['excerpt'] ?? null;
            $comment = $note['comment'] ?? null;
            $suggestion = $note['suggestion'] ?? null;

            if (
                ! is_string($category)
                || PostReviewCategory::tryFrom($category) === null
                || ! is_string($excerpt)
                || blank($excerpt)
                || ! is_string($comment)
                || blank($comment)
                || ! is_string($suggestion)
                || blank($suggestion)
            ) {
                throw new InvalidPostReview('A review note did not match the required schema.');
            }

            return [
                'category' => $category,
                'excerpt' => $excerpt,
                'comment' => $comment,
                'suggestion' => $suggestion,
            ];
        }, $notes);
    }

    /**
     * @return array<string, int|string>
     */
    private function failureContext(Throwable $throwable): array
    {
        $context = [
            'failure_type' => match (true) {
                $throwable instanceof ConnectionException => 'connection',
                $throwable instanceof RequestException => 'provider_http',
                $throwable instanceof InvalidPostReview => 'invalid_response',
                default => 'unexpected',
            },
            'exception_class' => $throwable::class,
        ];

        if (! $throwable instanceof RequestException) {
            return $context;
        }

        $context['provider_status'] = $throwable->response->status();
        $providerRequestId = $this->providerRequestId($throwable);

        if ($providerRequestId !== null) {
            $context['provider_request_id'] = $providerRequestId;
        }

        return $context;
    }

    private function providerRequestId(RequestException $exception): ?string
    {
        foreach (['request-id', 'x-request-id'] as $header) {
            $requestId = $exception->response->header($header);

            if (preg_match('/\A[A-Za-z0-9._:-]{1,255}\z/D', $requestId) === 1) {
                return $requestId;
            }
        }

        return null;
    }

    private function elapsedMilliseconds(int $startedAt): int
    {
        return (int) round(((int) hrtime(true) - $startedAt) / 1_000_000);
    }
}
