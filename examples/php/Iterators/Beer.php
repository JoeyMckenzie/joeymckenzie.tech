<?php

declare(strict_types=1);

namespace Examples\Iterators;

use Stringable;

final readonly class Beer implements Stringable
{
    public function __construct(
        public ?string $name = null,
        public ?float $abv = null,
        public ?int $ibu = null,
    ) {}

    #[\Override]
    public function __toString(): string
    {
        return <<<Beer
Name: $this->name
ABV: $this->abv
IBU: $this->ibu
Beer;
    }
}
