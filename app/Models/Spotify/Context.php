<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class Context
{
    public function __construct(public ?ContextUrls $externalUrls)
    {
    }
}
