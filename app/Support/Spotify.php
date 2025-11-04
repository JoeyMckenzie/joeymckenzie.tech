<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Spotify\NowPlayingResponse;
use App\Services\Spotify\FakeConnector;
use App\Services\Spotify\SpotifyConnectorContract;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Facade;

/**
 * @method static void assertAuthenticated()
 * @method static void assertNowPlaying()
 */
final class Spotify extends Facade
{
    private const string NOW_PLAYING_KEY = 'now-playing';

    public static function nowPlaying(): NowPlayingResponse
    {
        /** @var SpotifyConnectorContract $spotify */
        $spotify = self::getFacadeRoot();

        /** @var ?NowPlayingResponse $currentlyPlaying */
        $currentlyPlaying = Cache::get(self::NOW_PLAYING_KEY);

        if ($currentlyPlaying !== null) {
            // If using fake, track cache hit
            if ($spotify instanceof FakeConnector) {
                $spotify->setCacheHit();
            }

            return $currentlyPlaying;
        }

        try {
            $auth = $spotify->authenticate();
        } catch (ConnectionException) {
            return NowPlayingResponse::default();
        }

        $nowPlaying = $spotify->getNowPlaying($auth);

        Cache::put(self::NOW_PLAYING_KEY, $nowPlaying, now()->addMinutes(5));

        return $nowPlaying;
    }

    public static function fake(?NowPlayingResponse $response = null): FakeConnector
    {
        $fake = new FakeConnector($response);
        self::swap($fake);

        return $fake;
    }

    protected static function getFacadeAccessor(): string
    {
        return SpotifyConnectorContract::class;
    }
}
