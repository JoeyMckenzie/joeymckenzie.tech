<?php

declare(strict_types=1);

namespace App\Contracts;

use App\ValueObjects\NowPlaying;

interface MusicTrackerContract
{
    public function getNowPlaying(): NowPlaying;
}
