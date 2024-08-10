<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title("Hey, I'm Joey.")]
final class Home extends Component
{
    /** @var Collection<int, Post> */
    public ?Collection $posts = null;

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
            ->limit(3)
            ->get();
    }

    public function render(): View
    {
        return view('livewire.pages.index');
    }
}
