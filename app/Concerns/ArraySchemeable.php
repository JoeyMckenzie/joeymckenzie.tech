<?php

declare(strict_types=1);

namespace App\Concerns;

/**
 * @template TSchema of array
 */
interface ArraySchemeable
{
    /**
     * @return list<key-of<TSchema>>
     */
    public function schema(): array;
}
