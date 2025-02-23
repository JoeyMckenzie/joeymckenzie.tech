<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\BlueskyConnectorContract;
use App\Contracts\ContentUtilityContract;
use App\Contracts\MusicTrackerContract;
use App\Services\BlueskyConnector;
use App\Services\MarkdownContentUtility;
use App\Services\SpotifyTracker;
use Illuminate\Database\Eloquent\Model;
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
        $this->app->bind(ContentUtilityContract::class, MarkdownContentUtility::class);
        $this->app->bind(BlueskyConnectorContract::class, BlueskyConnector::class);
        $this->app->bind(MusicTrackerContract::class, SpotifyTracker::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::unguard();
        Model::shouldBeStrict();
    }
}
