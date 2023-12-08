<?php

namespace App\Console\Commands;

use App\Contracts\ContentUtilitiesContract;
use App\Models\ContentMeta;
use Illuminate\Console\Command;

final class ForceContentSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:force-content-sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     */
    public function handle(ContentUtilitiesContract $contentUtility): void
    {
        $files = $contentUtility->getMarkdownFilePaths();
        collect($files)
            ->map(fn (string $filePath) => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta) => $contentUtility->intoBlogPost($contentMeta));
    }
}
