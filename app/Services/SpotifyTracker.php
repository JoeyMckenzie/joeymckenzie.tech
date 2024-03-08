<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\MusicTrackerContract;
use App\ValueObjects\NowPlaying;
use DateInterval;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final readonly class SpotifyTracker implements MusicTrackerContract
{
    private const string NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player?type=track,episode';

    private const string TOKEN_URL = 'https://accounts.spotify.com/api/token';

    private const string NOW_PLAYING_KEY = 'nowPlaying';

    public function getNowPlaying(): NowPlaying
    {
        Log::info('retrieving Spotify now playing info');

        /** @var ?NowPlaying $currentlyPlaying */
        $currentlyPlaying = Cache::get(self::NOW_PLAYING_KEY);

        if (isset($currentlyPlaying)) {
            Log::info('cached now playing found');

            return $currentlyPlaying;
        }

        Log::info('now playing retrieved, adding to cache');

        $nowPlaying = self::getSpotifyNowPlaying();

        Cache::set('nowPlaying', $nowPlaying, new DateInterval('PT5M'));

        return $nowPlaying;
    }

    private function getSpotifyNowPlaying(): NowPlaying
    {
        $defaultResponse = new NowPlaying(false);

        try {
            // TODO: There's probably a cool collections/Adam Wathan way to do this,
            // i.e. pattern/match assign multiple values with a cast

            /** @var string $clientId */
            $clientId = config('spotify.client_id');

            /** @var string $clientSecret */
            $clientSecret = config('spotify.client_secret');

            /** @var string $refreshToken */
            $refreshToken = config('spotify.refresh_token');

            Log::info('requesting access token');

            // Get Access Token
            $accessTokenResponse = Http::withBasicAuth($clientId, $clientSecret)
                ->asForm()
                ->post(self::TOKEN_URL, [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);

            Log::info('access token retrieved, request now playing info');

            /** @var array{token_type: string, access_token: string} $authResponse */
            $authResponse = json_decode($accessTokenResponse->body(), true, JSON_THROW_ON_ERROR);
            $tokenType = $authResponse['token_type'];
            $accessToken = $authResponse['access_token'];
            $authorizationHeader = "$tokenType $accessToken";
            $nowPlayingResponse = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => $authorizationHeader,
            ])->get(self::NOW_PLAYING_URL);

            Log::info('now playing info retrieved');

            // Spotify returned a 204, so no content === not playing anything
            if ($nowPlayingResponse->status() === 204) {
                Log::info('not currently playing, returning default response');

                return $defaultResponse;
            } elseif ($nowPlayingResponse->failed()) {
                $message = $nowPlayingResponse->body();

                Log::error("an error occurred retrieving now playing info: $message");

                return $defaultResponse;
            }

            Log::info('now playing detected');

            /** @var array{item: array{name: string, album: array{images: array<int, array{url: string}>}|null, artists: array<int, array{name: string}>|null, show: array{name: string, images: array<int, array{url: string}>}|null, external_urls: array{spotify: ?string}}, currently_playing_type: string} $nowPlaying */
            $nowPlaying = json_decode($nowPlayingResponse->body(), true, JSON_THROW_ON_ERROR);

            // Most of the linking and track/show information come from the `item` and `context` node and we can largely ignore the majority of the response
            $item = $nowPlaying['item'];
            $trackTitle = $item['name'];
            $href = $item['external_urls']['spotify'] ?? '/';

            // The playing type will either be `"show"` or `"track"` based on a podcast or artist song
            // There's _a lot_ of presumptive `unwrap()`ing going here, should probably clean up eventually
            if ($nowPlaying['currently_playing_type'] === 'track' && isset($item['album']) && isset($item['artists'])) {
                $albumImage = $item['album']['images'][0];
                $artist = $item['artists'][0]['name'];

                return new NowPlaying(true, $href, $albumImage['url'], $trackTitle, $artist);
            } elseif (isset($item['show'])) {
                $show = $item['show'];
                $showImage = $show['images'][0];
                $showTitle = $show['name'];

                return new NowPlaying(true, $href, $showImage['url'], $trackTitle, $showTitle);
            }
        } catch (RequestException $e) {
            Log::info('error retrieving spotify now playing '.$e->getMessage());

            return $defaultResponse;
        }

        return $defaultResponse;
    }
}
