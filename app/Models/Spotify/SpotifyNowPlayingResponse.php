<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class SpotifyNowPlayingResponse
{
    public function __construct(
        public string $currentlyPlayingType,
        public Context $context,
        public Item $item
    ) {
    }
}
