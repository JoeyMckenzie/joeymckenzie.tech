<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class NowPlaying
{
    public function __construct(
        public bool $nowPlaying,
        public ?string $href = '',
        public ?string $albumImageSrc = '',
        public ?string $trackTitle = '',
        public ?string $artist = '',
    ) {
    }
}
