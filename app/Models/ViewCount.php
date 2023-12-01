<?php

declare(strict_types=1);

namespace App\Models;

final readonly class ViewCount
{
    public function __construct(
        public string $slug = '',
        public int $view_count = 0
    ) {
    }
}
