<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\PostReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final class PostReviewController extends Controller
{
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

    public function __construct(
        private readonly PostReviewService $reviews,
    ) {
        //
    }

    public function __invoke(Post $post): JsonResponse
    {
        $post->refresh();
        $reviewedSnapshot = $this->authoringSnapshot($post);

        try {
            $notes = $this->reviews->review($post->content, $post->id);
        } catch (Throwable) {
            return response()->json([
                'message' => 'The review could not be completed. Please retry.',
            ], 503);
        }

        try {
            $persistedReview = DB::transaction(function () use ($post, $reviewedSnapshot, $notes): ?array {
                $currentPost = Post::query()
                    ->whereKey($post->getKey())
                    ->lockForUpdate()
                    ->first();

                if (
                    $currentPost === null
                    || $reviewedSnapshot['updated_at'] === null
                    || $currentPost->getRawOriginal('updated_at') === null
                    || $this->authoringSnapshot($currentPost) !== $reviewedSnapshot
                ) {
                    return null;
                }

                $reviewedAt = now();
                $currentPost->latest_review = $notes;
                $currentPost->latest_review_at = $reviewedAt;

                Post::withoutTimestamps(fn (): bool => $currentPost->saveOrFail());

                return [
                    'notes' => $currentPost->latest_review,
                    'reviewedAt' => $reviewedAt->toIso8601String(),
                    'isStale' => $currentPost->reviewIsStale(),
                ];
            });
        } catch (Throwable $throwable) {
            Log::warning('Blog post review could not be saved', [
                'post_id' => $post->id,
                'exception_class' => $throwable::class,
            ]);

            return response()->json([
                'message' => 'The review could not be completed. Please retry.',
            ], 503);
        }

        if ($persistedReview === null) {
            return response()->json([
                'message' => 'The post changed while the review was running. Save and retry.',
            ], 409);
        }

        return response()->json([
            'review' => $persistedReview,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function authoringSnapshot(Post $post): array
    {
        $snapshot = [];

        foreach (self::REVIEW_INVALIDATING_ATTRIBUTES as $attribute) {
            $snapshot[$attribute] = $post->getRawOriginal($attribute);
        }

        return $snapshot;
    }
}
