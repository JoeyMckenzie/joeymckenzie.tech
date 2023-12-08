<?php

declare(strict_types=1);

namespace App\Models\Spotify;

final readonly class Item
{
    public function __construct(
        public string $name,
        public ?Album $album,
        public ?Show $show,
        /** @var ?Artist[] $artists */
        public ?array $artists,
        public ?ContextUrls $externalUrls
    ) {
    }
}
