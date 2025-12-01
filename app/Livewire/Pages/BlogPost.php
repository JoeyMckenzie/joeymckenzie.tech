<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use App\Services\CommonMarkHighlighter;
use App\Support\Seo\StructuredDataBuilder;
use Illuminate\View\View;
use League\CommonMark\Exception\CommonMarkException;
use Livewire\Component;
use Str;

final class BlogPost extends Component
{
    public Post $post;

    public string $content;

    /**
     * @throws CommonMarkException
     */
    public function mount(Post $post, CommonMarkHighlighter $highlighter): void
    {
        $this->post = $post->loadMissing('tag');
        $this->content = $highlighter->highlight($post->slug, $post->content) |> Str::markdown(...);
    }

    public function render(): View
    {
        $structuredData = StructuredDataBuilder::new()
            ->context('https://schema.org')
            ->type('BlogPosting')
            ->headline($this->post->title)
            ->description($this->post->description)
            ->image(asset($this->post->image))
            ->author('Joey McKenzie')
            ->publisher('Joey McKenzie')
            ->datePublished($this->post->published_at)
            ->dateModified($this->post->published_at)
            ->mainEntityOfPage(url()->current())
            ->make();

        return view('livewire.pages.blog-post')
            ->layout('components.layout', [
                'title' => $this->post->title,
                'description' => $this->post->description,
                'ogType' => 'article',
                'ogImage' => $this->post->image,
                'structuredData' => $structuredData->toArray(),
            ]);
    }
}
