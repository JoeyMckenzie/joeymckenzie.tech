<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use App\Contracts\MusicTrackerContract;
use App\ValueObjects\NowPlaying;
use Illuminate\View\View;
use Livewire\Component;

final class SpotifyCurrentlyListening extends Component
{
    public NowPlaying $nowPlaying;

    public function mount(MusicTrackerContract $musicTracker): void
    {
        $this->nowPlaying = $musicTracker->getNowPlaying();
    }

    public function render(): View
    {
        return view('livewire.components.spotify-currently-listening');
    }
}
