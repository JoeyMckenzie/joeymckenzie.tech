<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class SpotifyAuthResponse
{
    public function __construct(
        public string $accessToken,
        public string $tokenType
    ) {
    }
}
