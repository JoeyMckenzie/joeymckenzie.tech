<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Reaction;
use App\Models\Post;
use App\Models\PostReaction;
use App\Support\VisitorHash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

final class PostReactionController extends Controller
{
    /**
     * Per-type reaction counts plus the requesting visitor's current reactions.
     */
    public function index(Request $request, Post $post): JsonResponse
    {
        return response()->json($this->snapshot($request, $post));
    }

    /**
     * Toggle one reaction for the visitor: add it if absent, remove it if
     * present. Deduped per ip_hash per post by the unique index. Rate-limited
     * at the route.
     *
     * @throws ValidationException
     */
    public function store(Request $request, Post $post): JsonResponse
    {
        $reaction = $request->enum('reaction', Reaction::class);

        if ($reaction === null) {
            throw ValidationException::withMessages([
                'reaction' => 'Choose a valid reaction.',
            ]);
        }

        $ipHash = VisitorHash::for($request);

        $existing = $post->reactions()
            ->where('reaction', $reaction->value)
            ->where('ip_hash', $ipHash)
            ->first();

        if ($existing !== null) {
            $existing->delete();
        } else {
            $post->reactions()->create([
                'reaction' => $reaction,
                'ip_hash' => $ipHash,
            ]);
        }

        return response()->json($this->snapshot($request, $post));
    }

    /**
     * @return array{counts: array<string, int>, userReactions: array<int, string>}
     */
    private function snapshot(Request $request, Post $post): array
    {
        $reactions = $post->reactions()->get(['reaction', 'ip_hash']);
        $ipHash = VisitorHash::for($request);

        $counts = [];

        foreach (Reaction::cases() as $case) {
            $counts[$case->value] = $reactions->where('reaction', $case)->count();
        }

        $userReactions = $reactions
            ->where('ip_hash', $ipHash)
            ->map(fn (PostReaction $reaction): string => $reaction->reaction->value)
            ->values()
            ->all();

        return [
            'counts' => $counts,
            'userReactions' => $userReactions,
        ];
    }
}
