<?php

declare(strict_types=1);

namespace Examples\Iterators;

final class Beer
{
    public function __construct(
        public ?string $name = null,
        public ?float $abv = null,
        public ?int $ibu = null,
        public ?int $breweryId = null,
    ) {}
}
