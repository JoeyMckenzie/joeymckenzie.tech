<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

final class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $resolver = static fn () => Post::query()
            ->with('tag:id,name')
            ->latestPublished()
            ->limit(3)
            ->get([
                'slug',
                'title',
                'description',
                'image',
                'tag_id',
                'published_at',
                'storage_key',
                'content',
            ])
            ->values()
            ->toArray();

        $recentPosts = App::isProduction()
            ? Cache::remember('home:recent_posts', now()->addMinutes(5), $resolver)
            : $resolver();

        return Inertia::render('home', [
            'recentPosts' => $recentPosts,
        ]);
    }
}
