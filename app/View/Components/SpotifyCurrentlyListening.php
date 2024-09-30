<?php

declare(strict_types=1);

namespace App\View\Components;

use App\Contracts\MusicTrackerContract;
use App\ValueObjects\SpotifyNowPlayingApiResponse;
use Illuminate\View\Component;
use Illuminate\View\View;
use Override;

final class SpotifyCurrentlyListening extends Component
{
    public SpotifyNowPlayingApiResponse $nowPlaying;

    public function __construct(private readonly MusicTrackerContract $musicTracker) {}

    #[Override]
    public function render(): View
    {
        $this->nowPlaying = $this->musicTracker->getNowPlaying();

        return view('components.spotify-currently-listening');
    }
}
