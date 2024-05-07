<?php

declare(strict_types=1);

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;
use Override;

final class SpotifyNotPlaying extends Component
{
    #[Override]
    public function render(): View
    {
        return view('components.spotify-not-playing');
    }
}
