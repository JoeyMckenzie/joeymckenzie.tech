<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use App\Queries\AllPostsQuery;
use App\Support\Seo\StructuredDataBuilder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Config;
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
        $structuredData = StructuredDataBuilder::new()
            ->context('https://schema.org')
            ->type('Blog')
            ->headline(Config::string('app.name').' Blog')
            ->description('Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with by Joey McKenzie.')
            ->author('Joey McKenzie')
            ->publisher(Config::string('app.name'))
            ->mainEntityOfPage(url()->current())
            ->make();

        /** @var View $view */
        $view = view('livewire.pages.blog')
            ->layout('components.layout', [
                'title' => 'Blog',
                'description' => 'Long-form thoughts on Laravel, PHP, and whatever else I\'m tinkering with.',
                'ogType' => 'website',
                'structuredData' => $structuredData->toArray(),
            ]);

        return $view;
    }
}
