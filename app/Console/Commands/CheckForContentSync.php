<?php

namespace App\Console\Commands;

use App\Jobs\SyncContent;
use App\Models\ContentSync;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

final class CheckForContentSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-for-content-sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs content from markdown files into the database.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        /** @var string $commit */
        $commit = config('app.commit');
        $currentSync = ContentSync::firstWhere('commit', $commit);

        // In the case we've already synced, bail out of the process
        // Helpful for Fly deployments where containers are constantly
        // being brought down/restarted
        if ($currentSync?->exists) {
            Log::info("Content sync has already been done for $commit, bypassing");
        } else {
            Log::info("Content has not been synced, dispatching sync event for $commit");
            SyncContent::dispatch($commit);
        }
    }
}
