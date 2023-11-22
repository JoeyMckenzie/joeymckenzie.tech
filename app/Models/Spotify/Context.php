<?php

namespace App\Models\Spotify;

final readonly class Context
{
    public function __construct(public ?ContextUrls $externalUrls)
    {
    }
}
