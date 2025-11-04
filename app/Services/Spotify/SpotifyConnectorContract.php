<?php

declare(strict_types=1);

namespace App\Services\Spotify;

use App\Data\Spotify\AuthResponse;
use App\Data\Spotify\NowPlayingResponse;
use Illuminate\Http\Client\ConnectionException;

interface SpotifyConnectorContract
{
    /**
     * @throws ConnectionException
     */
    public function authenticate(): AuthResponse;

    public function getNowPlaying(AuthResponse $auth): NowPlayingResponse;
}
