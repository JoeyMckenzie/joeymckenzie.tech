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
use Illuminate\Support\Facades\Log;
use Override;

final class SpotifyTracker implements MusicTrackerContract
{
    private const string NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player?type=track,episode';

    private const string TOKEN_URL = 'https://accounts.spotify.com/api/token';

    private const string NOW_PLAYING_KEY = 'nowPlaying';

    #[Override]
    public function getNowPlaying(): SpotifyNowPlayingApiResponse
    {
        Log::info('retrieving Spotify now playing info');

        /** @var ?SpotifyNowPlayingApiResponse $currentlyPlaying */
        $currentlyPlaying = Cache::get(self::NOW_PLAYING_KEY);

        if ($currentlyPlaying !== null) {
            Log::info('cached now playing found');

            return $currentlyPlaying;
        }

        Log::info('now playing retrieved, adding to cache');

        $nowPlaying = self::getSpotifyNowPlaying();

        Cache::set('nowPlaying', $nowPlaying, new DateInterval('PT5M'));

        return $nowPlaying;
    }

    private function getSpotifyNowPlaying(): SpotifyNowPlayingApiResponse
    {
        try {
            // TODO: There's probably a cool collections/Adam Wathan way to do this,
            // i.e. pattern/match assign multiple values with a cast

            $clientId = Config::string('spotify.client_id');
            $clientSecret = Config::string('spotify.client_secret');
            $refreshToken = Config::string('spotify.refresh_token');

            Log::info('requesting access token');

            $accessTokenResponse = Http::withBasicAuth($clientId, $clientSecret)
                ->asForm()
                ->post(self::TOKEN_URL, [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);

            Log::info('access token retrieved, request now playing info');

            $authResponse = SpotifyAuthApiResponse::fromResponse($accessTokenResponse);
            $nowPlayingResponse = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => $authResponse->authorizationHeader,
            ])->get(self::NOW_PLAYING_URL);

            Log::info('now playing info retrieved');

            // Spotify returned a 204, so no content === not playing anything
            if ($nowPlayingResponse->status() === 204) {
                Log::info('not currently playing, returning default response');

                return SpotifyNowPlayingApiResponse::default();
            }

            if ($nowPlayingResponse->failed()) {
                $message = $nowPlayingResponse->body();
                Log::error("an error occurred retrieving now playing info: $message");

                return SpotifyNowPlayingApiResponse::default();
            }

            Log::info('now playing detected, parsing response');

            return SpotifyNowPlayingApiResponse::fromResponse($nowPlayingResponse);
        } catch (Exception $e) {
            Log::info('error retrieving spotify now playing '.$e->getMessage());
        }

        return SpotifyNowPlayingApiResponse::default();
    }
}
