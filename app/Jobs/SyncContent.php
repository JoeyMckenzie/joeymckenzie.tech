<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Contracts\ContentUtilitiesContract;
use App\Models\ContentMeta;
use App\Models\ContentSync;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncContent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $commit)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(ContentUtilitiesContract $contentUtility): void
    {
        $files = $contentUtility->getMarkdownFilePaths();
        collect($files)
            ->map(fn (string $filePath) => $contentUtility->getParsedContent($filePath))
            ->each(fn (ContentMeta $contentMeta) => $contentUtility->intoBlogPost($contentMeta));

        Log::info("Setting content sync for commit $this->commit");

        ContentSync::create(['commit' => $this->commit])->save();
    }
}
