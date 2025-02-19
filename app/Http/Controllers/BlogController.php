<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\PanAnalytic;
use App\Models\Post;
use App\ValueObjects\PostPreview;
use Illuminate\Http\Request;
use Illuminate\View\View;

final class BlogController
{
    public function index(Request $request): View
    {
        $category = $request->query('category');
        $posts = Post::query()
            ->select([
                'slug',
                'title',
                'description',
                'category',
                'published_date',
            ])
            ->orderByDesc('published_date')
            ->get();

        if ($category !== null) {
            $posts = $posts->where('category', $category);
        }

        $analytics = PanAnalytic::query()
            ->select(['name', 'impressions'])
            ->get();

        return view('blog', [
            'postPreviews' => $posts->map(fn (Post $post): \App\ValueObjects\PostPreview => PostPreview::from($post, $analytics)),
        ]);
    }

    public function show(string $slug): View
    {
        $post = Post::select([
            'slug',
            'title',
            'description',
            'published_date',
            'parsed_content',
            'hero_image',
        ])->firstWhere('slug', $slug);

        if ($post === null) {
            abort(404);
        }

        return view('blog-post', [
            'post' => $post,
        ]);
    }
}
