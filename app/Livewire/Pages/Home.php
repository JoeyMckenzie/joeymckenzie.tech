<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\View\View;
use Livewire\Component;

final class Home extends Component
{
    /**
     * @var Collection<int, Post>
     */
    public Collection $posts;

    public function mount(): void
    {
        $this->posts = Post::query()
            ->with('tag:id')
            ->limit(3)
            ->latest('published_at')
            ->get([
                'slug',
                'title',
                'description',
                'tag_id',
                'published_at',
            ]);
    }

    public function render(): View
    {
        return view('livewire.pages.home');
    }
}
