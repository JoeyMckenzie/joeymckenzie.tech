<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Concurrency;
use Statamic\Facades\Entry;
use Statamic\Facades\Markdown;

final class WarmBlogCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:warm-blog-cache-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $entries = Entry::query()
            ->where('collection', 'blogs')
            ->where('published', true)
            ->get(['content']);

        $this->info("Warming cache for {$entries->count()} blog entries...");

        Concurrency::defer([
            // ?
        ]);

        foreach ($entries as $entry) {
            $key = $entry->slug();
            $content = $entry->get('content');

            Cache::rememberForever($key, fn () => Markdown::parser('default')->parse($content));

            $this->line("Cached: $key");
        }

        $this->info('Blog cache warming complete!');
    }
}
