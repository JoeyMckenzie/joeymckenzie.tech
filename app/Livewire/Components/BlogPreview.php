<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use App\Models\Post;
use Illuminate\View\View;
use Livewire\Attributes\Computed;
use Livewire\Component;

final class BlogPreview extends Component
{
    public Post $post;

    #[Computed]
    public function displayDate(): string
    {
        return $this->post->published_date->format('M j, Y');
    }

    #[Computed]
    public function href(): string
    {
        return '/blog/'.$this->post->slug;
    }

    public function mount(Post $post): void
    {
        $this->post = $post;
    }

    public function render(): View
    {
        return view('livewire.components.blog-preview');
    }
}
