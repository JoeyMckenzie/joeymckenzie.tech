<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use App\Services\CommonMarkHighlighter;
use Illuminate\View\View;
use Livewire\Component;
use Str;

final class BlogPost extends Component
{
    public Post $post;

    public string $content;

    public function mount(Post $post, CommonMarkHighlighter $highlighter): void
    {
        $this->post = $post->loadMissing('tag');
        $highlighted = $highlighter->highlight($post->slug, $post->content);
        $this->content = Str::markdown($highlighted);
    }

    public function render(): View
    {
        return view('livewire.pages.blog-post');
    }
}
