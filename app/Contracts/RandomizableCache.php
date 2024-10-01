<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * @template TValue cache value
 */
interface RandomizableCache
{
    /**
     * @return null|TValue
     */
    public function getRandomValue(): mixed;
}
