<?php

declare(strict_types=1);

namespace App\Actions;

use App\Data\Spotify\NowPlayingResponse;
use App\Support\Spotify;
use Illuminate\Support\Facades\Log;

final class GetNowPlayingFromSpotifyAction
{
    public function handle(): NowPlayingResponse
    {
        $nowPlaying = Spotify::nowPlaying();

        Log::info('Now playing: '.$nowPlaying->trackTitle);

        return $nowPlaying;
    }
}
