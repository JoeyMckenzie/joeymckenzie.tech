<?php

namespace App\Console\Commands;

use App\Contracts\MusicTrackerContract;
use App\Services\BlogPostRepository;
use Illuminate\Console\Command;

final class PreloadCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:preload-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Preloads the content cache and the currently listening info on spotify.
     */
    public function handle(BlogPostRepository $repository, MusicTrackerContract $musicTracker): void
    {
        $musicTracker->getNowPlaying();
        $repository->getBlogPostMetadata();
    }
}
