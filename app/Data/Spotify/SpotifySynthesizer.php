<?php

declare(strict_types=1);

namespace App\Data\Spotify;

use Livewire\Mechanisms\HandleComponents\Synthesizers\Synth;

/**
 * @phpstan-type SpotifySchema array{
 *     nowPlaying: bool,
 *     href: ?string,
 *     albumImageSrc: ?string,
 *     trackTitle: ?string,
 *     artist: ?string
 * }
 */
final class SpotifySynthesizer extends Synth
{
    public static string $key = 'spotify';

    public static function match(mixed $target): bool
    {
        return $target instanceof NowPlayingResponse;
    }

    /**
     * @return array{0: SpotifySchema, 1: mixed}
     */
    public function dehydrate(NowPlayingResponse $target): array
    {
        return [
            [
                'nowPlaying' => $target->nowPlaying,
                'href' => $target->href,
                'albumImageSrc' => $target->albumImageSrc,
                'trackTitle' => $target->trackTitle,
                'artist' => $target->artist,
            ],
            [],
        ];
    }

    /**
     * @param array{
     *     nowPlaying: bool,
     *     href: ?string,
     *     albumImageSrc: ?string,
     *     trackTitle: ?string,
     *     artist: ?string
     * } $value
     */
    public function hydrate(array $value): NowPlayingResponse
    {
        $instance = new NowPlayingResponse;
        $instance->nowPlaying = $value['nowPlaying'];
        $instance->href = $value['href'];
        $instance->albumImageSrc = $value['albumImageSrc'];
        $instance->trackTitle = $value['trackTitle'];
        $instance->artist = $value['artist'];

        return $instance;
    }
}
