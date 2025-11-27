<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use App\Queries\AllPostsQuery;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\View\View;
use Livewire\Attributes\Title;
use Livewire\Component;

final class Blog extends Component
{
    /**
     * @var Collection<int, Post>
     */
    public Collection $posts;

    public function mount(AllPostsQuery $posts): void
    {
        $this->posts = $posts->execute();
    }

    #[Title('Blog.')]
    public function render(): View
    {
        return view('livewire.pages.blog');
    }
}
