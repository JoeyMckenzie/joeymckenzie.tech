<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;
use Statamic\Facades\Markdown;

final class WarmBlogCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:warm-blog-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Warms the Statamic cache with shiki content for the blog.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $entries = Entry::query()
            ->where('collection', 'blogs')
            ->where('published', true)
            ->get(['content']);

        $this->info("Warming cache for {$entries->count()} blog entries...");

        foreach ($entries as $entry) {
            $this->info("Caching: {$entry->slug()}");

            $key = $entry->slug();
            $content = $entry->get('content');

            Cache::rememberForever($key, fn () => Markdown::parser('default')->parse($content));

            $this->info("Cached: {$entry->slug()}");
        }

        foreach ($entries as $entry) {
            if (! Cache::has($entry->slug())) {
                $this->error("Cache missing for: {$entry->slug()}");
            }
        }

        $this->info('Blog cache warming complete!');
    }
}
