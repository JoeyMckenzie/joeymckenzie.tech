<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

final readonly class Sitemapper
{
    private Sitemap $sitemap;

    public function __construct()
    {
        $this->sitemap = Sitemap::create();
    }

    public function create(): Sitemap
    {
        /** @var Sitemap $sitemap */
        $sitemap = Cache::rememberForever('sitemap.xml', function (): Sitemap {
            $this->addStaticPages();
            $this->addPosts();

            return $this->sitemap;
        });

        return $sitemap;
    }

    private function addStaticPages(): void
    {
        $this->sitemap->add(Url::create('/')
            ->setLastModificationDate(now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(1.0));

        $this->sitemap->add(Url::create('/blog')
            ->setLastModificationDate(now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(0.9));

        $this->sitemap->add(Url::create('/now')
            ->setLastModificationDate(now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            ->setPriority(0.7));
    }

    private function addPosts(): void
    {
        /** @var Collection<int, Post> $posts */
        $posts = Post::query() // @phpstan-ignore-line method.nonObject
            ->published()
            ->latest('published_at')
            ->get(['slug', 'published_at']);

        foreach ($posts as $post) {
            $lastMod = Date::parse($post->published_at);

            $this->sitemap->add(Url::create("/blog/$post->slug")
                ->setLastModificationDate($lastMod)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority(0.8));
        }
    }
}
