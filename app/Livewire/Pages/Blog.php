<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Contracts\ContentRepositoryContract;
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

    public function mount(ContentRepositoryContract $contentRepository): void
    {
        $this->posts = $contentRepository->getBlogPostMetadata();
    }

    public function render(): View
    {
        return view('livewire.pages.blog');
    }
}
