<?php

declare(strict_types=1);

namespace App\Services\Spotify;

use Illuminate\Contracts\Support\Arrayable;

/**
 * @implements Arrayable<string, string|null>
 */
final readonly class NowPlayingData implements Arrayable
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
