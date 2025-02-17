<?php

declare(strict_types=1);

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

final class BlueskyPost extends Component
{
    public function __construct(
        public string $username,
        public string $handle,
        public string $content,
        public string $avatar,
        public string $postUrl,
        public string $timestamp,
        public int $replyCount = 0,
        public int $repostCount = 0,
        public int $likeCount = 0,
        public ?string $image = null,
    ) {}

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
