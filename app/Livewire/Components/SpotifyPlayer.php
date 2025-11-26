<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use App\Data\Spotify\NowPlayingResponse;
use App\Support\Spotify;
use Illuminate\View\View;
use Livewire\Component;

final class SpotifyPlayer extends Component
{
    public NowPlayingResponse $nowPlaying;

    public function mount(): void
    {
        $this->nowPlaying = Spotify::nowPlaying();
    }

    public function render(): View
    {
        return view('livewire.components.spotify-player');
    }
}
