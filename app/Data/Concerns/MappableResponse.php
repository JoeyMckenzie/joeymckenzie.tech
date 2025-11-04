<?php

declare(strict_types=1);

namespace App\Data\Concerns;

use Illuminate\Http\Client\Response;

interface MappableResponse
{
    public static function fromResponse(Response $response): self;
}
