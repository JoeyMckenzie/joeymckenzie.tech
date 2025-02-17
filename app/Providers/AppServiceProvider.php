<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\BlueskyConnectorContract;
use App\Contracts\ContentUtilityContract;
use App\Services\BlueskyConnector;
use App\Services\MarkdownContentUtility;
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
