<?php

declare(strict_types=1);

namespace App\Services\Spotify;

/**
 * Normalised "now playing" shape for both tracks and podcast episodes.
 *
 * The frontend footer widget only needs a few fields; this isolates callers
 * from Spotify's verbose API response.
 */
final readonly class NowPlayingData
{
    public function __construct(
        public string $title,
        public string $artist,
        public ?string $albumImage = null,
        public ?string $href = null,
    ) {
        //
    }

    /**
     * @return array{title: string, artist: string, albumImage: string|null, href: string|null}
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'artist' => $this->artist,
            'albumImage' => $this->albumImage,
            'href' => $this->href,
        ];
    }
}
