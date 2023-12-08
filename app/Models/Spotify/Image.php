<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class Image
{
    public function __construct(public string $url)
    {
    }
}
