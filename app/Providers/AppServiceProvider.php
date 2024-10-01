<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ContentUtilityContract;
use App\Contracts\MusicTrackerContract;
use App\Contracts\RandomizableCache;
use App\Services\MarkdownContentUtility;
use App\Services\OfficeQuotesCache;
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
        $this->app->singleton(ContentUtilityContract::class, MarkdownContentUtility::class);
        $this->app->singleton(RandomizableCache::class, OfficeQuotesCache::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
