<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\PostReviewStatus;
use App\Http\Controllers\Controller;
use App\Jobs\ReviewPost;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

final class PostReviewController extends Controller
{
    public function __invoke(Post $post): JsonResponse
    {
        $post->refresh();

        $post->review_status = PostReviewStatus::Pending;
        $post->review_dispatched_at = now();

        Post::withoutTimestamps(fn (): bool => $post->saveOrFail());

        ReviewPost::dispatch($post->id, ReviewPost::snapshotFor($post));

        return response()->json([], Response::HTTP_ACCEPTED);
    }
}
