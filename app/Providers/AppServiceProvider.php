<?php

namespace App\Providers;

use App\Utilities\ContentCache;
use App\Utilities\SpotifyTracker;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ContentCache::class);
        $this->app->singleton(SpotifyTracker::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ContentCache::initContentCache();
    }
}
