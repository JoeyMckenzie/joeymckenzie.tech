<?php

namespace App\Jobs;

use App\Models\BlogPost;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class AddView implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $slug, public int $currentViews)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("adding view for $this->slug");

        BlogPost::firstWhere('slug', $this->slug)
            ?->update([
                'views' => $this->currentViews + 1,
            ]);

        $this->release();
    }
}
