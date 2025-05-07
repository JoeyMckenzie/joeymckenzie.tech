<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\GetCurrentSpotifyStatusAction;
use Illuminate\Support\Facades;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View;
use Spatie\CommonMarkShikiHighlighter\HighlightCodeExtension;
use Statamic\Facades\Markdown;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Markdown::addExtensions(function () {
            return [
                new HighlightCodeExtension(theme: 'one-dark-pro'),
            ];
        });

        Facades\View::composer('*', function (View $view) {
            $response = new GetCurrentSpotifyStatusAction()->handle();

            $view->with('spotifyStatus', [
                'nowPlaying' => $response->nowPlaying,
                'href' => $response->href,
                'albumImageSrc' => $response->albumImageSrc,
                'trackTitle' => $response->trackTitle,
                'artist' => $response->artist,
            ]);
        });
    }
}
