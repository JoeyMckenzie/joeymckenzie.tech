<?php

declare(strict_types=1);

namespace App\ValueObjects;

use BadFunctionCallException;
use Livewire\Wireable;
use Override;

final class NavigationItem implements Wireable
{
    public function __construct(
        public string $display,
        public string $href
    ) {
    }

    #[Override]
    public static function fromLivewire(mixed $value): void
    {
        throw new BadFunctionCallException('Navigation items are not meant to be deserialized.');
    }

    /**
     * @return array{display: string, href: string}
     */
    #[Override]
    public function toLivewire(): array
    {
        return [
            'display' => $this->display,
            'href' => $this->href,
        ];
    }
}
