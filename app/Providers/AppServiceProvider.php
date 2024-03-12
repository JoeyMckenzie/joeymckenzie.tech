<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ContentRepositoryContract;
use App\Contracts\ContentUtilityContract;
use App\Contracts\MusicTrackerContract;
use App\Services\MarkdownUtility;
use App\Services\PostRepository;
use App\Services\SpotifyTracker;
use Illuminate\Support\ServiceProvider;
use Override;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[Override]
    public function register(): void
    {
        $this->app->singleton(MusicTrackerContract::class, SpotifyTracker::class);
        $this->app->singleton(ContentRepositoryContract::class, PostRepository::class);
        $this->app->singleton(ContentUtilityContract::class, MarkdownUtility::class);
    }
}
