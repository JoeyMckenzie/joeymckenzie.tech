<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class ContextUrls
{
    public function __construct(public ?string $spotify)
    {
    }
}
