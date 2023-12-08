<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class Artist
{
    public function __construct(public string $name)
    {
    }
}
