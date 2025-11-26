<?php

declare(strict_types=1);

namespace App\Providers;

use App\Data\Spotify\SpotifySynthesizer;
use App\Services\Spotify\SpotifyConnector;
use App\Services\Spotify\SpotifyConnectorContract;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;
use Override;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[Override]
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        self::configureServices();
        self::configureSynthesizers();
        self::configureModels();
        self::configureVite();
        self::configureSchema();
        self::configureCommands();
        self::configureDates();
    }

    private function configureServices(): void
    {
        $this->app->bind(SpotifyConnectorContract::class, SpotifyConnector::class);
    }

    private function configureSynthesizers(): void
    {
        Livewire::propertySynthesizer(SpotifySynthesizer::class);
    }

    private function configureModels(): void
    {
        Model::automaticallyEagerLoadRelationships();
        Model::unguard();
        Model::shouldBeStrict();
    }

    private function configureVite(): void
    {
        Vite::useAggressivePrefetching();
    }

    private function configureSchema(): void
    {
        URL::forceHttps();
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );
    }

    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }
}
