<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Spotify\NowPlayingResponse;
use App\Services\Spotify\FakeConnector;
use App\Services\Spotify\SpotifyConnectorContract;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Facade;

/**
 * @method static void assertAuthenticated()
 * @method static void assertNowPlaying()
 */
final class Spotify extends Facade
{
    public static function nowPlaying(): NowPlayingResponse
    {
        /** @var SpotifyConnectorContract $spotify */
        $spotify = self::getFacadeRoot();

        try {
            $auth = $spotify->authenticate();
        } catch (ConnectionException) {
            return NowPlayingResponse::default();
        }

        return $spotify->getNowPlaying($auth);
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
