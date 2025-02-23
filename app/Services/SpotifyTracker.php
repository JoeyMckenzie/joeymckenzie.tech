<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\MusicTrackerContract;
use App\ValueObjects\SpotifyAuthApiResponse;
use App\ValueObjects\SpotifyNowPlayingApiResponse;
use DateInterval;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Override;

final readonly class SpotifyTracker implements MusicTrackerContract
{
    private const string NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player?type=track,episode';

    private const string TOKEN_URL = 'https://accounts.spotify.com/api/token';

    private const string NOW_PLAYING_KEY = 'nowPlaying';

    #[Override]
    public function getNowPlaying(): SpotifyNowPlayingApiResponse
    {
        if (app()->isProduction()) {
            /** @var ?SpotifyNowPlayingApiResponse $currentlyPlaying */
            $currentlyPlaying = Cache::get(self::NOW_PLAYING_KEY);

            if ($currentlyPlaying !== null) {
                return $currentlyPlaying;
            }
        }

        $nowPlaying = self::getSpotifyNowPlaying();

        Cache::put('nowPlaying', $nowPlaying, new DateInterval('PT5M'));

        return $nowPlaying;
    }

    private function getSpotifyNowPlaying(): SpotifyNowPlayingApiResponse
    {
        try {
            $clientId = Config::string('spotify.client_id');
            $clientSecret = Config::string('spotify.client_secret');
            $refreshToken = Config::string('spotify.refresh_token');
            $accessTokenResponse = Http::withBasicAuth($clientId, $clientSecret)
                ->asForm()
                ->post(self::TOKEN_URL, [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);

            $authResponse = SpotifyAuthApiResponse::fromResponse($accessTokenResponse);
            $nowPlayingResponse = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => $authResponse->authorizationHeader,
            ])->get(self::NOW_PLAYING_URL);

            // Spotify returned a 204, so no content === not playing anything
            if ($nowPlayingResponse->status() === 204) {
                return SpotifyNowPlayingApiResponse::default();
            }

            if ($nowPlayingResponse->failed()) {
                return SpotifyNowPlayingApiResponse::default();
            }

            $response = SpotifyNowPlayingApiResponse::fromResponse($nowPlayingResponse);
        } catch (Exception) {
            $response = SpotifyNowPlayingApiResponse::default();
        }

        return $response;
    }
}
