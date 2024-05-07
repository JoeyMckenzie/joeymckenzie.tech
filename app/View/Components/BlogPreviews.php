<?php

declare(strict_types=1);

namespace App\View\Components;

use App\Models\Post;
use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Illuminate\View\View;

final class BlogPreviews extends Component
{
    /**
     * @param  Collection<int, Post>  $posts
     */
    public function __construct(public readonly Collection $posts)
    {
    }

    #[\Override]
    public function render(): View
    {
        return view('components.blog-previews');
    }
}
