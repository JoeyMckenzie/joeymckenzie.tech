<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ContentUtilityContract;
use App\Services\MarkdownContentUtility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ContentUtilityContract::class, MarkdownContentUtility::class);
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
