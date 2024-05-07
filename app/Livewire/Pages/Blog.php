<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Blog.')]
final class Blog extends Component
{
    /** @var Collection<int, Post> */
    public Collection $posts;

    public function mount(): void
    {
        $this->posts = Post::select([
            'slug',
            'published_date',
            'category',
            'description',
            'title',
            'views',
        ])
            ->orderByDesc('published_date')
            ->get();
    }

    public function render(): View
    {
        return view('livewire.pages.blog');
    }
}
