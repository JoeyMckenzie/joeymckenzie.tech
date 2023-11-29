<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Contracts\ContentRepositoryContract;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

final class GenerateContentCache implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
    }

    /**
     * Execute the job.
     */
    public function handle(ContentRepositoryContract $contentRepository): void
    {
        Log::info('generating content cache');

        $contentRepository->cacheContentMetas();

        Log::info('content metas generated and cached');
    }
}
