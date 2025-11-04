<?php

declare(strict_types=1);

namespace App\Data\Concerns;

interface Defaultable
{
    public static function default(): self;
}
