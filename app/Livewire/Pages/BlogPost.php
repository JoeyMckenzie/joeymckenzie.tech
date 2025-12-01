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
        $build = StructuredDataBuilder::new()
            ->headline($this->post->title)
            ->description($this->post->description)
            ->make();

        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $this->post->title,
            'description' => $this->post->description,
            'image' => asset($this->post->image),
            'author' => [
                '@type' => 'Person',
                'name' => 'Joey McKenzie',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
            ],
            'datePublished' => $this->post->published_at,
            'dateModified' => $this->post->published_at,
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => url()->current(),
            ],
        ];

        return view('livewire.pages.blog-post')
            ->title($this->post->title)
            ->with([
                'description' => $this->post->description,
                'ogType' => 'article',
                'ogImage' => $this->post->image ? asset($this->post->image) : null,
                'structuredData' => $structuredData,
            ]);
    }
}
