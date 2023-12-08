<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class Album
{
    public function __construct(
        public string $name,
        /** @var Image[] $images */
        public array $images,
    ) {
    }
}
