<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Illuminate\Http\Client\Response;

final class SpotifyNowPlayingApiResponse
{
    private function __construct(
        public bool $nowPlaying,
        public ?string $href = '',
        public ?string $albumImageSrc = '',
        public ?string $trackTitle = '',
        public ?string $artist = '')
    {
        //
    }

    public static function fromResponse(Response $response): self
    {
        /** @var array{item: array{name: string, album: array{images: array<int, array{url: string}>}|null, artists: array<int, array{name: string}>|null, show: array{name: string, images: array<int, array{url: string}>}|null, external_urls: array{spotify: ?string}}, currently_playing_type: string} $nowPlaying */
        $nowPlaying = json_decode($response->body(), true, JSON_THROW_ON_ERROR);

        // Most of the linking and track/show information come from the `item` and `context` node and we can largely ignore the majority of the response
        $item = $nowPlaying['item'];
        $trackTitle = $item['name'];
        $href = $item['external_urls']['spotify'] ?? '/';

        // The playing type will either be `"show"` or `"track"` based on a podcast or artist song
        // There's _a lot_ of presumptive `unwrap()`ing going here, should probably clean up eventually
        if ($nowPlaying['currently_playing_type'] === 'track' && $item['album'] !== null && $item['artists'] !== null) {
            $albumImage = $item['album']['images'][0];
            $artist = $item['artists'][0]['name'];

            return new self(true, $href, $albumImage['url'], $trackTitle, $artist);
        }

        if ($item['show'] !== null) {
            $show = $item['show'];
            $showImage = $show['images'][0];
            $showTitle = $show['name'];

            return new self(true, $href, $showImage['url'], $trackTitle, $showTitle);
        }

        return self::default();
    }

    public static function default(): self
    {
        return new self(false);
    }
}
