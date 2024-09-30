<?php

declare(strict_types=1);

namespace App\ValueObjects;

final readonly class DisplayableIcon
{
    public function __construct(
        public string  $href,
        public string  $display,
        public ?string $icon = null
    )
    {
    }
}
