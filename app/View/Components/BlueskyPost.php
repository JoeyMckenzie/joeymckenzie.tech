<?php

declare(strict_types=1);

namespace App\View\Components;

use App\ValueObjects\BlueskyPostMeta;
use Illuminate\View\Component;
use Illuminate\View\View;

final class BlueskyPost extends Component
{
    public function __construct(
        public BlueskyPostMeta $post
    ) {
        //
    }

    public function formatCount(int $count): string
    {
        if ($count >= 1000) {
            return number_format($count / 1000, 1).'K';
        }

        return (string) $count;
    }

    public function render(): View
    {
        return view('components.bluesky-post');
    }
}
