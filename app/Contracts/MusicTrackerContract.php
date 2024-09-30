<?php

declare(strict_types=1);

namespace App\Contracts;

use App\ValueObjects\SpotifyNowPlayingApiResponse;

interface MusicTrackerContract
{
    public function getNowPlaying(): SpotifyNowPlayingApiResponse;
}
