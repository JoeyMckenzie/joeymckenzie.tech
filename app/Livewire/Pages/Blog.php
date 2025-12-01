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
        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => 'Blog',
            'name' => config('app.name').' Blog',
            'description' => 'Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with by Joey McKenzie.',
            'url' => url()->current(),
            'author' => [
                '@type' => 'Person',
                'name' => 'Joey McKenzie',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
            ],
        ];

        return view('livewire.pages.blog')
            ->with([
                'description' => 'Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with.',
                'ogType' => 'website',
                'structuredData' => $structuredData,
            ]);
    }
}
