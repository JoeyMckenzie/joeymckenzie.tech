<?php

namespace App\Console\Commands;

use App\Contracts\ContentUtilityContract;
use App\Models\ContentMeta;
use App\Models\ContentSync;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

final class SyncContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-content';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     */
    public function handle(ContentUtilityContract $contentUtility): void
    {
        /** @var string $commit */
        $commit = config('app.commit');

        Log::info("Checking for content sync on commit $commit");

        $currentSync = ContentSync::firstWhere('commit', $commit);

        // In the case we've already synced, bail out of the process
        // Helpful for Fly deployments where containers are constantly
        // being brought down/restarted and balanced amongst the fleet
        if (! is_null($currentSync)) {
            Log::info("Content sync has already been done for $commit, bypassing");

            return;
        }

        Log::info("Content has not been synced, running content updates for $commit");

        $files = $contentUtility->getMarkdownFilePaths();
        collect($files)
            ->map(fn (string $filePath) => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta) => $contentUtility->upsertBlogPost($contentMeta));

        Log::info("Content successfully synced for $commit");

        ContentSync::create(['commit' => $commit])->save();
    }
}
