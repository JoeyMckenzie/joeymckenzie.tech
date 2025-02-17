<?php

declare(strict_types=1);

namespace App\Contracts;

use App\ValueObjects\BlueskyPostMeta;

interface BlueskyConnectorContract
{
    public function getLatestPost(): BlueskyPostMeta;
}
