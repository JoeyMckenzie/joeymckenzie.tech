<?php

namespace App\Models\Spotify;

final readonly class AccessTokenResponse
{
    public function __construct(
        public string $accessToken,
        public string $tokenType
    ) {
    }
}
