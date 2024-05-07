<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Models\Post;
use Illuminate\View\View;
use Livewire\Component;

final class BlogPost extends Component
{
    public Post $post;

    public function mount(string $slug): void
    {
        $post = Post::query()
            ->with('keywords')
            ->select([
                'id',
                'slug',
                'hero_image',
                'published_date',
                'category',
                'title',
                'parsed_content',
                'views',
            ])->firstWhere('slug', $slug);

        if ($post === null) {
            abort(404);
        }

        $post->views += 1;
        $post->save();
        $this->post = $post;
    }

    public function render(): View
    {
        return view('livewire.pages.blog-post')
            ->title($this->post->title);
    }
}
