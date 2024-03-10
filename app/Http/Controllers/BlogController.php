<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\ContentRepositoryContract;
use Inertia\Inertia;
use Inertia\Response;

final class BlogController extends Controller
{
    public function __construct(private readonly ContentRepositoryContract $contentRepository)
    {
    }

    public function index(): Response
    {
        $frontMatters = collect($this->contentRepository->getBlogPostMetadata())->toArray();

        return Inertia::render('Blog/Index', [
            'frontMatters' => array_values($frontMatters),
        ]);
    }

    public function show(string $slug): Response
    {
        $post = $this->contentRepository->getBlogPostBySlug($slug);
        $keywords = $post->keywords()->pluck('word')->toArray();

        return Inertia::render('Blog/Post', [
            'post' => $post,
            'keywords' => $keywords,
        ]);
    }
}
