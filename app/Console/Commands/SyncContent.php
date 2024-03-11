<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\ContentUtilityContract;
use App\ValueObjects\ContentMeta;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Throwable;

final class SyncContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'content:sync';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     *
     * @throws Throwable
     */
    public function handle(ContentUtilityContract $contentUtility): void
    {
        $files = $contentUtility->getMarkdownFilePaths();
        $endpoints = config('misc.production_url').'api/views';

        /** @var array<int, array{slug: string, views: int}> $views */
        $views = Http::get($endpoints)->json();

        collect($files)
            ->map(fn (string $filePath): \App\ValueObjects\ContentMeta => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta): \App\Models\Post => $contentUtility->upsertBlogPostWithViewCount($contentMeta, $views));
    }
}
