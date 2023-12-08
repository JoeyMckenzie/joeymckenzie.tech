<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ContentRepositoryContract;
use App\Contracts\ContentUtilityContract;
use App\Contracts\MusicTrackerContract;
use App\Services\BlogPostRepository;
use App\Services\MarkdownUtility;
use App\Services\SpotifyTracker;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(MusicTrackerContract::class, SpotifyTracker::class);
        $this->app->singleton(ContentRepositoryContract::class, BlogPostRepository::class);
        $this->app->singleton(ContentUtilityContract::class, MarkdownUtility::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
