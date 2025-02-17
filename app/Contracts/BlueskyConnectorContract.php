<?php

declare(strict_types=1);

namespace App\Contracts;

interface BlueskyConnectorContract
{
    public function getLatestPost();

    public function getAuthToken(): string;
}
