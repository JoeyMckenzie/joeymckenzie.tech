<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Illuminate\Support\Str;

final class NavigationItem
{
    public function __construct(
        public string $text,
        public string $href
    ) {}

    public function getActiveClass(): string
    {
        $route = request()->path();

        if ($this->href === '/' && $this->href === $route) {
            return 'underline';
        }

        if (Str::contains($route, Str::substr($this->href, 1))) {
            return 'underline';
        }

        return 'hover:underline';
    }
}
