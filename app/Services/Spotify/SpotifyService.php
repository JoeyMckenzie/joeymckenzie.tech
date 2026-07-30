<?php

declare(strict_types=1);

namespace App\Services\Spotify;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Talks to the Spotify Web API to report what's currently playing.
 *
 * The access token is short-lived (~1h) so it's cached for 10 minutes and
 * refreshed on demand. {@see nowPlaying()} returns null when nothing is
 * playing or the API errors — callers render a graceful fallback.
 */
final class SpotifyService
{
    private const string TOKEN_CACHE_KEY = 'spotify:access_token';

    private const int TOKEN_TTL_SECONDS = 600;

    /**
     * @param  array<string, ?string>  $item  A single item from the player response.
     */
    private function mapItem(array $item): NowPlayingData
    {
        $type = $item['type'] ?? 'track';

        if ($type === 'episode') {
            $episode = $item['episode'] ?? $item;

            return new NowPlayingData(
                title: $episode['name'] ?? '',
                artist: $episode['show']['name'] ?? $episode['publisher'] ?? '',
                albumImage: $episode['images'][0]['url'] ?? null,
                href: $episode['external_urls']['spotify'] ?? $episode['href'] ?? null,
            );
        }

        $track = $item['track'] ?? $item;

        return new NowPlayingData(
            title: $track['name'] ?? '',
            artist: collect($track['artists'] ?? [])
                ->pluck('name')
                ->take(2)
                ->implode(', '),
            albumImage: $track['album']['images'][0]['url'] ?? null,
            href: $track['external_urls']['spotify'] ?? $track['href'] ?? null,
        );
    }

    private function playerRequest(): PendingRequest
    {
        return Http::withToken($this->getAccessToken())
            ->withHeaders(['Accept' => 'application/json'])
            ->timeout(5);
    }

    /**
     * Return the current track or podcast episode, or null when nothing is
     * playing (paused, idle) or the API errors.
     */
    public function nowPlaying(): ?NowPlayingData
    {
        $response = $this->playerRequest()
            ->get('https://api.spotify.com/v1/me/player', [
                'additional_types' => 'track,episode',
            ]);

        if (! $response->ok()) {
            // 204 = no active device (nothing playing); other codes are errors we log.
            if ($response->status() !== 204) {
                Log::warning('Spotify player request failed', [
                    'status' => $response->status(),
                ]);
            }

            return null;
        }

        $data = $response->json();

        if (! is_array($data)) {
            return null;
        }

        /** @var array<string, mixed> $data */
        $isPlaying = ($data['is_playing'] ?? false) === true;
        $item = $data['item'] ?? null;

        if (! $isPlaying || ! is_array($item)) {
            return null;
        }

        /** @var array<string, mixed> $item */
        return $this->mapItem($item);
    }

    /**
     * Exchange the refresh token for a fresh access token, cached for 10 minutes.
     */
    private function getAccessToken(): string
    {
        return Cache::remember(
            self::TOKEN_CACHE_KEY,
            self::TOKEN_TTL_SECONDS,
            fn (): string => $this->refreshAccessToken(),
        );
    }

    private function refreshAccessToken(): string
    {
        $response = Http::asForm()
            ->timeout(5)
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'refresh_token',
                'refresh_token' => Config::string('services.spotify.refresh_token'),
                'client_id' => Config::string('services.spotify.client_id'),
                'client_secret' => Config::string('services.spotify.client_secret'),
            ]);

        if (! $response->ok()) {
            Log::warning('Spotify token refresh failed', [
                'status' => $response->status(),
            ]);

            return '';
        }

        return $response->json('access_token') ?? '';
    }

    /**
     * Forget the cached access token — used in tests after faking the token endpoint.
     */
    public function clearTokenCache(): void
    {
        Cache::forget(self::TOKEN_CACHE_KEY);
    }
}
