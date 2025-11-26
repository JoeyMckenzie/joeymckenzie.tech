<?php

declare(strict_types=1);

namespace App\Queries\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 */
interface Queryable
{
    /**
     * @return Collection<int, TModel>
     */
    public function execute(?int $limit = null): Collection;
}
