<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\Spotify\SpotifyService;
use Illuminate\Cache\CacheManager;
use Illuminate\Http\JsonResponse;

/**
 * Returns the current Spotify track/episode as JSON, response cached ~30s so
 * the footer widget can poll cheaply. Falls back to a `null` payload when
 * nothing is playing or the API errors.
 */
final class SpotifyNowPlayingController extends Controller
{
    public function __construct(
        private readonly SpotifyService $spotify,
        private readonly CacheManager $cache,
    ) {
        //
    }

    public function __invoke(): JsonResponse
    {
        $payload = $this->cache->remember(
            'spotify:now_playing',
            now()->addSeconds(30),
            fn (): array => [
                'nowPlaying' => $this->spotify->nowPlaying()?->toArray(),
            ],
        );

        return response()->json($payload);
    }
}
