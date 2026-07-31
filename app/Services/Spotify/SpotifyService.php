<?php

declare(strict_types=1);

namespace App\Services\Spotify;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

final class SpotifyService
{
    private const string TOKEN_CACHE_KEY = 'spotify:access_token';

    private const int TOKEN_TTL_SECONDS = 600;

    /**
     * @param  array<mixed>  $item  A single item from the player response.
     */
    private function mapItem(array $item): NowPlayingData
    {
        $type = $this->stringValue($item['type'] ?? null) ?? 'track';

        if ($type === 'episode') {
            $episode = is_array($item['episode'] ?? null) ? $item['episode'] : $item;

            return new NowPlayingData(
                title: $this->stringValue($episode['name'] ?? null) ?? '',
                artist: $this->episodeArtist($episode),
                albumImage: $this->firstImageUrl($episode),
                href: $this->spotifyHref($episode),
            );
        }

        $track = is_array($item['track'] ?? null) ? $item['track'] : $item;

        return new NowPlayingData(
            title: $this->stringValue($track['name'] ?? null) ?? '',
            artist: $this->trackArtists($track),
            albumImage: $this->albumImageUrl($track),
            href: $this->spotifyHref($track),
        );
    }

    private function playerRequest(): PendingRequest
    {
        return Http::withToken($this->getAccessToken())
            ->acceptJson()
            ->timeout(5);
    }

    public function nowPlaying(): ?NowPlayingData
    {
        $response = $this->playerRequest()
            ->get('https://api.spotify.com/v1/me/player', [
                'additional_types' => 'track,episode',
            ]);

        if (! $response->ok()) {
            if ($response->status() !== Response::HTTP_NO_CONTENT) {
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

        $isPlaying = ($data['is_playing'] ?? false) === true;
        $item = $data['item'] ?? null;

        if (! $isPlaying || ! is_array($item)) {
            return null;
        }

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
            $this->refreshAccessToken(),
        );
    }

    private function refreshAccessToken(): string
    {
        $response = Http::asForm()
            ->withBasicAuth(
                Config::string('services.spotify.client_id'),
                Config::string('services.spotify.client_secret'),
            )
            ->timeout(5)
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'refresh_token',
                'refresh_token' => Config::string('services.spotify.refresh_token'),
            ]);

        if (! $response->ok()) {
            Log::warning('Spotify token refresh failed', [
                'status' => $response->status(),
            ]);

            return '';
        }

        return $this->stringValue($response->json('access_token')) ?? '';
    }

    public function exchangeAuthorizationCode(string $code, string $redirectUri): ?string
    {
        $response = Http::asForm()
            ->withBasicAuth(
                Config::string('services.spotify.client_id'),
                Config::string('services.spotify.client_secret'),
            )
            ->timeout(5)
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => $redirectUri,
            ]);

        if (! $response->ok()) {
            Log::warning('Spotify authorization code exchange failed', [
                'status' => $response->status(),
            ]);

            return null;
        }

        return $this->stringValue($response->json('refresh_token'));
    }

    /**
     * @param  array<mixed>  $episode
     */
    private function episodeArtist(array $episode): string
    {
        $show = $episode['show'] ?? null;

        if (is_array($show)) {
            $showName = $this->stringValue($show['name'] ?? null);

            if ($showName !== null) {
                return $showName;
            }
        }

        return $this->stringValue($episode['publisher'] ?? null) ?? '';
    }

    /**
     * @param  array<mixed>  $track
     */
    private function trackArtists(array $track): string
    {
        $artists = $track['artists'] ?? null;

        if (! is_array($artists)) {
            return '';
        }

        $names = [];

        foreach ($artists as $artist) {
            if (! is_array($artist)) {
                continue;
            }

            $name = $this->stringValue($artist['name'] ?? null);

            if ($name !== null) {
                $names[] = $name;
            }

            if (count($names) === 2) {
                break;
            }
        }

        return implode(', ', $names);
    }

    /**
     * @param  array<mixed>  $track
     */
    private function albumImageUrl(array $track): ?string
    {
        $album = $track['album'] ?? null;

        return is_array($album) ? $this->firstImageUrl($album) : null;
    }

    /**
     * @param  array<mixed>  $item
     */
    private function firstImageUrl(array $item): ?string
    {
        $images = $item['images'] ?? null;

        if (! is_array($images) || ! isset($images[0]) || ! is_array($images[0])) {
            return null;
        }

        return $this->stringValue($images[0]['url'] ?? null);
    }

    /**
     * @param  array<mixed>  $item
     */
    private function spotifyHref(array $item): ?string
    {
        $externalUrls = $item['external_urls'] ?? null;

        if (is_array($externalUrls)) {
            $spotifyUrl = $this->stringValue($externalUrls['spotify'] ?? null);

            if ($spotifyUrl !== null) {
                return $spotifyUrl;
            }
        }

        return $this->stringValue($item['href'] ?? null);
    }

    private function stringValue(mixed $value): ?string
    {
        return is_string($value) && filled($value) ? $value : null;
    }
}
