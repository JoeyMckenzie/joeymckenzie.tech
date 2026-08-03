<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use Symfony\Component\HttpFoundation\Response;

final class SitemapController extends Controller
{
    private const array STATIC_ROUTE_NAMES = [
        'home',
        'blog.index',
        'now',
        'uses',
        'cv',
        'style-guide',
    ];

    public function __invoke(Request $request): Response
    {
        $sitemap = Sitemap::create();

        foreach (self::STATIC_ROUTE_NAMES as $routeName) {
            $sitemap->add(Url::create(route($routeName)));
        }

        Post::query()
            ->published()
            ->orderByDesc('published_at')
            ->get(['slug'])
            ->each(fn (Post $post): Sitemap => $sitemap->add(
                Url::create(route('blog.show', $post)),
            ));

        return $sitemap->toResponse($request);
    }
}
