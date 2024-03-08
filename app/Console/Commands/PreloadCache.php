<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\ContentRepositoryContract;
use App\Contracts\MusicTrackerContract;
use Illuminate\Console\Command;

final class PreloadCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:preload';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Command description';

    /**
     * Preloads the content cache and the currently listening info on spotify.
     */
    public function handle(ContentRepositoryContract $repository, MusicTrackerContract $musicTracker): void
    {
        $musicTracker->getNowPlaying();
        $repository->getBlogPostMetadata();
    }
}
