<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ContentRepositoryContract;
use App\Contracts\MusicTrackerContract;
use App\Services\MarkdownContentRepository;
use App\Services\SpotifyTracker;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ContentRepositoryContract::class, fn () => MarkdownContentRepository::initContentCache());
        $this->app->singleton(MusicTrackerContract::class, SpotifyTracker::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
