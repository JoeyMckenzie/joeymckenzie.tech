<?php

declare(strict_types=1);

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

final class SpotifyNowPlaying extends Component
{
    public function __construct(
        public readonly string $href,
        public readonly string $albumImageSrc,
        public readonly string $trackTitle,
        public readonly string $artist,
    ) {
    }

    public function render(): View
    {
        return view('components.spotify-now-playing');
    }
}
