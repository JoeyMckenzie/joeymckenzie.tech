<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\ContentUtilityContract;
use App\ValueObjects\ContentMeta;
use Illuminate\Console\Command;
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
        collect($files)
            ->map(fn (string $filePath) => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta) => $contentUtility->upsertBlogPost($contentMeta));
    }
}
