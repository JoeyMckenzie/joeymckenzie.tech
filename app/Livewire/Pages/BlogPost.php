<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use Illuminate\View\View;
use Livewire\Component;

final class BlogPost extends Component
{
    public Post $post;

    public function mount(Post $post): void
    {
        $this->post = $post;
    }

    public function render(): View
    {
        return view('livewire.pages.blog-post');
    }
}
