<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Spotify\NowPlaying;

interface MusicTrackerContract
{
    public function getNowPlaying(): NowPlaying;
}
