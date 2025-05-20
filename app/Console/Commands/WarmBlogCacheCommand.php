<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Spatie\ShikiPhp\Shiki;
use Statamic\Entries\EntryCollection;
use Statamic\Facades\Entry;
use Statamic\Facades\Markdown;

final class WarmBlogCacheCommand extends Command
{
    /**
     * @var string
     */
    protected $signature = 'app:warm-blog-cache';

    /**
     * @var string|null
     */
    protected $description = 'Warms the Statamic cache with shiki content for the blog.';

    public function handle(): void
    {
        /** @var EntryCollection $entries */
        $entries = Entry::query() // @phpstan-ignore-line
            ->where('collection', 'blogs')
            ->where('published', true)
            ->get(['content']);

        $this->info("Warming cache for {$entries->count()} blog entries...");

        /** @var \Statamic\Entries\Entry $entry */
        foreach ($entries as $entry) {
            /** @var string $key */
            $key = $entry->slug();

            $this->info("Caching: $key");

            /** @var string $content */
            $content = $entry->get('content');

            Cache::rememberForever($key, fn () => Markdown::parser('default')->parse($content));

            $this->info("Cached: $key");
        }

        /** @var \Statamic\Entries\Entry $entry */
        foreach ($entries as $entry) {
            /** @var string $key */
            $key = $entry->slug();

            if (! Cache::has($key)) {
                $this->error("Cache missing for: $key");
            }
        }

        $this->info('Blog cache warming complete!');
    }

    private function highlightAndCacheCode(string $markdown): string
    {
        $pattern = '/```(.*?)\n(.*?)```/s';

        /** @var string $cached */
        $cached = preg_replace_callback(
            $pattern,
            static function (array $matches) { // @phpstan-ignore-line
                $language = mb_trim($matches[1]);
                $code = mb_trim($matches[2]);
                $hash = md5($language.$code);
                $cacheKey = "shiki_snippet_$hash";

                return Cache::rememberForever($cacheKey, function () use ($language, $code) {
                    return Shiki::highlight(
                        code: $code,
                        language: $language,
                        theme: 'one-dark-pro',
                    );
                });
            }, $markdown);

        return $cached;
    }
}
