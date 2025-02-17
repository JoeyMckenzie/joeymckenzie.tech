<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\BlueskyConnectorContract;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

final class BlueskyConnector implements BlueskyConnectorContract
{
    private const string BASE_URL = 'https://bsky.social/xrpc';

    public function getLatestPost(): void
    {
        // TODO: Implement getLatestPost() method.
    }

    public function getAuthToken(): string
    {
        $url = sprintf('%s/com.atproto.server.createSession', self::BASE_URL);
        Http::withHeader('Content-Type', 'application/json')
            ->post($url, [
                'identifier' => Config::string('bluesky.username'),
                'password' => Config::string('bluesky.password'),
            ]);
        // TODO: Implement getAuthToken() method.
    }
}
