<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use App\Queries\AllPostsQuery;
use App\Support\Seo\StructuredDataBuilder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\View\View;
use Livewire\Attributes\Title;
use Livewire\Component;

final class Home extends Component
{
    /**
     * @var Collection<int, Post>
     */
    public Collection $posts;

    public function mount(AllPostsQuery $posts): void
    {
        $this->posts = $posts->execute(3);
    }

    #[Title("Hi, I'm Joey.")]
    public function render(): View
    {
        $structuredData = StructuredDataBuilder::new()
            ->context('https://schema.org')
            ->type('Person')
            ->headline('Joey McKenzie - Software Developer')
            ->description('Personal website and blog of Joey McKenzie, sharing thoughts on Laravel, PHP, and web development.')
            ->author('Joey McKenzie')
            ->mainEntityOfPage(url()->current())
            ->make();

        return view('livewire.pages.home')
            ->layout('components.layout', [
                'title' => "Hi, I'm Joey",
                'description' => 'Personal website and blog of Joey McKenzie, sharing thoughts on Laravel, PHP, and web development.',
                'ogType' => 'profile',
                'structuredData' => $structuredData->toArray(),
            ]);
    }
}
