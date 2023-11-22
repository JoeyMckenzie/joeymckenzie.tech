<?php

namespace App\Utilities;

use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final readonly class SpotifyTracker
{
    private const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player?type=track,episode';

    private const TOKEN_URL = 'https://accounts.spotify.com/api/token';

    private const NOW_PLAYING_KEY = 'nowPlaying';

    public function getNowPlaying(): string
    {
        /** @var string|null $currentlyPlaying */
        $currentlyPlaying = Cache::get(self::NOW_PLAYING_KEY);

        if (isset($currentlyPlaying)) {
            return $currentlyPlaying;
        }

        $test = self::getSpotifyNowPlaying();

        return '';
    }

    private function getSpotifyNowPlaying()
    {
        $defaultResponse = [
            'nowPlaying' => false,
        ];

        try {
            // TODO: There's probably a cool collections/Adam Wathan way to do this,
            // i.e. pattern/match assign multiple values with a cast

            /** @var string $clientId */
            $clientId = config('spotify.client_id');
            /** @var string $clientSecret */
            $clientSecret = config('spotify.client_secret');
            /** @var string $refreshToken */
            $refreshToken = config('spotify.refresh_token');

            $requestMeta = [
                'headers' => [
                    'Authorization' => 'Basic '.base64_encode("$clientId:$clientSecret"),
                    'Accept' => 'application/json',
                ],
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ],
            ];

            // Get Access Token
            $accessTokenResponse = Http::withBasicAuth($clientId, $clientSecret)
                ->asForm()
                ->post(self::TOKEN_URL, [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);

            $authResponse = $accessTokenResponse->json();
            $authorizationHeader = "{$authResponse['token_type']} {$authResponse['access_token']}";

            // Get Now Playing
            $nowPlayingResponse = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => $authorizationHeader,
            ])->get(self::NOW_PLAYING_URL);

            // Spotify returned a 204, so no content === not playing anything
            if ($nowPlayingResponse->status() === 204) {
                return $defaultResponse;
            }

            $nowPlaying = json_decode($nowPlayingResponse->body(), true);

            // Most of the linking and track/show information come from the `item` and `context` node and we can largely ignore the majority of the response
            $item = $nowPlaying['item'];
            $context = $nowPlaying['context'];
            $trackTitle = $item['name'];
            $href = $item['external_urls']['spotify'] ?? $context['external_urls']['spotify'] ?? '/';

            // The playing type will either be `"show"` or `"track"` based on a podcast or artist song
            // There's _a lot_ of presumptive `unwrap()`ing going here, should probably clean up eventually
            if ($nowPlaying['currently_playing_type'] === 'track') {
                $albumImage = $item['album']['images'][0];
                $artist = $item['artists'][0]['name'];

                return [
                    'albumImageSrc' => $albumImage['url'],
                    'artist' => $artist,
                    'href' => $href,
                    'trackTitle' => $trackTitle,
                    'nowPlaying' => true,
                ];
            } else {
                $show = $item['show'];
                $showImage = $show['images'][0];
                $showTitle = $show['name'];

                return [
                    'albumImageSrc' => $showImage['url'],
                    'artist' => $showTitle,
                    'href' => $href,
                    'trackTitle' => $trackTitle,
                    'nowPlaying' => true,
                ];
            }
        } catch (RequestException $e) {
            Log::info('error retrieving spotify now playing '.$e->getMessage());

            return $defaultResponse;
        }
    }
}
