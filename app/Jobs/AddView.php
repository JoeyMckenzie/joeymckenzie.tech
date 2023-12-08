<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\BlogPost;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Log;

class AddView implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public BlogPost $post)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $slug = $this->post->slug;

        Log::info("adding view for $slug");

        $this->post->views += 1;
        $this->post->save();
    }
}
